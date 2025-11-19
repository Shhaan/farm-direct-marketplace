
from django.urls import path
from .views import *
urlpatterns = [
         path('currentuser/', Currentuser.as_view(), name='current-use'),
         path('register/user/', Registeruser.as_view(), name='Registeruser'),
        path('register/otp-verification', Verifyotp.as_view(), name='Verifyotp'),
         
         
         
]
