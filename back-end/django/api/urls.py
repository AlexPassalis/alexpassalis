from django.urls import path
from .views import save_email

urlpatterns = [
    path('email', save_email, name='save_email'),
]