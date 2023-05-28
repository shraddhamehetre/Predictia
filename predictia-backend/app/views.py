import json
import random
import re
from datetime import datetime, timezone

from django.http import HttpResponse

from django.contrib.auth import authenticate, login
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from rest_framework.views import APIView

from .models import Dyslexia, Dysgraphia, Dyscalculia
from .serializers import UserSerializer, DysgraphiaSerializer, DyslexiaSerializer, DyscalculiaSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets

from rest_framework.authentication import TokenAuthentication

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

import cv2
import numpy as np

from . import model


# Create your views here.

def testServer(request):
    return HttpResponse("Server is live")


class APILoginView(generics.CreateAPIView):
    csrf_exempt = True
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            print(user)
            token, created = Token.objects.get_or_create(user=user)
            print(user.id)
            return Response({"token": token.key, "user": user.username, "id": user.id}, status=200)
        else:
            return Response({"error": "Invalid credentials"}, status=400)


class APIRegistrationView(generics.CreateAPIView):
    csrf_exempt = True
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            user.set_password(request.data.get("password"))
            user.save()

            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": user.username, "id": user.id}, status=201)
        except Exception as e:
            print(e)
            return Response(e.__dict__, status=400)


class LogoutView(viewsets.ViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(methods=['post'], detail=False)
    def logout(self, request):
        user = request.user
        user.auth_token.delete()
        return Response({"detail": "Successfully logged out."})


class DyslexiaView(generics.CreateAPIView):
    csrf_exempt = True
    permission_classes = (IsAuthenticated,)
    queryset = Dyslexia.objects.all()
    serializer_class = DyslexiaSerializer
    authentication_classes = [TokenAuthentication]

    def __init__(self):
        print("Rendering")

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Exception :: ", e)

        image = request.FILES.get('image')

        filename = default_storage.save(image.name, ContentFile(image.read()))
        filepath = default_storage.path(filename)

        # Read the image file using cv2
        img = cv2.imread(filepath)

        # Convert the image to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Threshold the image to segment the characters
        _, thresholded = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY_INV)

        # Perform morphological operations to clean up the image
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        thresholded = cv2.morphologyEx(thresholded, cv2.MORPH_CLOSE, kernel)

        # Find the contours of the characters
        contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Iterate through the contours
        seperated_chars = []
        for i, contour in enumerate(contours):
            # Get the bounding rectangle of the contour
            x, y, w, h = cv2.boundingRect(contour)
            # Crop the character using array slicing
            character = thresholded[y:y + h, x:x + w]

            # convert each image into RGB format and pass it to model
            rgb = cv2.cvtColor(character, cv2.COLOR_GRAY2RGB)
            seperated_chars.append(cv2.resize(rgb, (28, 28)))

        prediction_arr = model.predict(np.array(seperated_chars))
        prediction_mean_arr = np.mean(prediction_arr, axis=0)
        print("Actual Prediction :: ", prediction_mean_arr)

        print("user", request.user)
        dyslexia = Dyslexia()
        dyslexia.user = request.user
        dyslexia.image = request.FILES.get('image')
        dyslexia.checked_date = datetime.now(timezone.utc).date()
        dyslexia.score = {"0": str(prediction_mean_arr[0]), "1": str(prediction_mean_arr[1])}
        dyslexia.details = "Total " + str(len(seperated_chars)) + " Characters analysed"
        try:
            dyslexia.save()

        except Exception as e:
            print(e)
            return Response(data=e, status=400)

        default_storage.delete(filepath)
        if prediction_mean_arr[0] > prediction_mean_arr[1]:
            print("Not Detected, accuracy: {:5.2f}%".format(100 * prediction_mean_arr[0]))
            return Response(data={
                "Detected": False,
                "accuracy": "{:5.2f}".format(100 * prediction_mean_arr[0]),
                "total_chars_found": str(len(seperated_chars))
            }, status=200)
        else:
            return Response(data={
                "Detected": True,
                "accuracy": "{:5.2f}".format(100 * prediction_mean_arr[1]),
                "total_chars_found": str(len(seperated_chars))
            },status=200)

    def get(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Exception :: ", e)
        print(request.user)

        return Response(data=list(self.queryset.filter(user=self.request.user.id).values()), status=200)



class DysgraphiaView(APIView):
    csrf_exempt = True
    permission_classes = (IsAuthenticated,)
    queryset = Dysgraphia.objects.all()
    serializer_class = DysgraphiaSerializer
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        with open("ml_model\\dysgraphia\\sentences.json", "r") as f:
            data = json.load(f)
        sentences = data["sentences"]

        random_sentences = random.sample(sentences, 5)
        return Response({"sentences": random_sentences})

    def post(self, request, *args, **kwargs):
        response = request.data

        def levenshtein_distance(s1, s2):
            # Create a matrix of zeros with dimensions (len(s1) + 1) x (len(s2) + 1)
            distances = [[0 for j in range(len(s2) + 1)] for i in range(len(s1) + 1)]

            # Initialize the first row and column of the matrix
            for i in range(1, len(s1) + 1):
                distances[i][0] = i
            for j in range(1, len(s2) + 1):
                distances[0][j] = j

            # Compute the distances between all pairs of substrings of s1 and s2
            for j in range(1, len(s2) + 1):
                for i in range(1, len(s1) + 1):
                    if s1[i - 1] == s2[j - 1]:
                        distances[i][j] = distances[i - 1][j - 1]
                    else:
                        distances[i][j] = min(distances[i - 1][j], distances[i][j - 1], distances[i - 1][j - 1]) + 1

            # Return the Levenshtein distance between s1 and s2
            return distances[-1][-1]

        for x in response:
            actual_text = re.sub(r'[^\w\s]', '', str(response[x]["actual"]).lower())
            typed_text = re.sub(r'[^\w\s]', '', str(response[x]["typed"]).lower())

            # Calculate the Levenshtein distance between the actual and typed text
            distance = levenshtein_distance(actual_text, typed_text)

            # Calculate the accuracy as a percentage
            accuracy = (1 - (distance / len(actual_text))) * 100

            response[x]["accuracy"] = "{:.2f}".format(accuracy)
            #
            # # Tokenize the sentence
            # # nltk.download('punkt')
            # # nltk.download('stopwords')
            # # nltk.download('averaged_perceptron_tagger')
            # # nltk.download('maxent_ne_chunker')
            # # nltk.download('words')
            # # nltk.download('vader_lexicon')
            #
            # tokens = word_tokenize(typed_text)
            #
            # # Remove stop words
            # stop_words = set(stopwords.words('english'))
            # filtered_tokens = [word for word in tokens if word.lower() not in stop_words]
            #
            # # Spell check
            # spell_checker = SpellChecker("en_US")
            # spell_checked_tokens = []
            # for word in filtered_tokens:
            #     spell_checker.set_text(word)
            #     for error in spell_checker:
            #         word = error.suggest()[0]
            #     spell_checked_tokens.append(word)
            #
            # # POS tagging
            # tagged_tokens = pos_tag(spell_checked_tokens)
            #
            # # Grammar check
            # tool = language_tool_python.LanguageTool('en-US')
            # corrected_sentence = tool.correct(typed_text)
            #
            # # Calculate accuracy
            # corrected_tokens = word_tokenize(corrected_sentence)
            # num_correct = len(set(corrected_tokens).intersection(set(spell_checked_tokens)))
            # accuracy = num_correct / len(spell_checked_tokens) * 100
            #
            # # Print results
            # print("Original sentence:", typed_text)
            # print("Corrected sentence:", corrected_sentence)
            # print("Accuracy: {:.2f}%".format(accuracy))

        dysgraphia = Dysgraphia()
        dysgraphia.user = request.user
        dysgraphia.checked_date = datetime.now(timezone.utc).date()
        dysgraphia.test_result = response

        try:
            dysgraphia.save()
        except Exception as e:
            print(e)
            return Response(data=e, status=400)
        return Response(response)

    def put(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Exception :: ", e)
        return Response(data=list(self.queryset.filter(user=self.request.user.id).values()), status=200)

class DyscalculiaView(APIView):
    csrf_exempt = True
    permission_classes = (IsAuthenticated,)
    queryset = Dyscalculia.objects.all()
    serializer_class = DyscalculiaSerializer
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        with open("ml_model\\dyscalculia\\question_bank.json", "r") as f:
            data = json.load(f)
        random_problems = random.sample(data, 5)
        return Response({"problems": random_problems})

    def post(self, request, *args, **kwargs):
        response = request.data
        correct_ans = 0

        for x in response:
            if response[x]["actual_answer"] == response[x]["answer_given"]:
                correct_ans += 1

        response["prediction"] = "{:.2f}".format((correct_ans/5)*100)

        dyscalculia = Dyscalculia()
        dyscalculia.user = request.user
        dyscalculia.checked_date = datetime.now(timezone.utc).date()
        dyscalculia.test_result = response

        try:
            dyscalculia.save()
        except Exception as e:
            print(e)
            return Response(data=e, status=400)

        return Response(response)

    def put(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Exception :: ", e)
        return Response(data=list(self.queryset.filter(user=self.request.user.id).values()), status=200)

