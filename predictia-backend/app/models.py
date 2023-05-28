from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Dyslexia(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.JSONField()
    image = models.ImageField(upload_to='images/')
    checked_date = models.DateField(null=True, blank=True)
    details = models.TextField(null=True, blank=True)


class Dysgraphia(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test_result = models.JSONField()
    checked_date = models.DateField(null=True, blank=True)


class Dyscalculia(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test_result = models.JSONField()
    checked_date = models.DateField(null=True, blank=True)

