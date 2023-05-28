from django.urls import path

from . import views
from .views import APILoginView, APIRegistrationView, LogoutView, DyslexiaView, DysgraphiaView, DyscalculiaView

urlpatterns = [
    path('', views.testServer, name='test'),
    path('login/', APILoginView.as_view(), name='login'),
    path('register/', APIRegistrationView.as_view(), name='register'),
    path('logout/', LogoutView.as_view({'post': 'logout'})),
    path('predict/dyslexia/', DyslexiaView.as_view(), name='dyslexia prediction'),
    path('predict/dysgraphia/', DysgraphiaView.as_view(), name='dysgraphia prediction'),
    path('predict/dyscalculia/', DyscalculiaView.as_view(), name='dyscalculia prediction')
]