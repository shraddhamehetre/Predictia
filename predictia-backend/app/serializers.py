from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Dysgraphia, Dyslexia, Dyscalculia


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class DyslexiaSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def perform_create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().perform_create(validated_data)

    class Meta:
        model = Dyslexia
        fields = ('user', 'score', 'checked_date', 'details', "image")


class DysgraphiaSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def perform_create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().perform_create(validated_data)

    class Meta:
        model = Dysgraphia
        fields = ('user', 'test_result', 'checked_date')


class DyscalculiaSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Dyscalculia
        fields = ('user', 'score', 'checked_date', 'details')
