from django.urls import path
from .views import *

urlpatterns = [
    path('auth/api/login/',GoogleLoginApi.as_view(),name='googleLogin'),
     
    
]