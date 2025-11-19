from django.urls import path
from .views import *
urlpatterns = [
         path('login/<str:email>', Adminlogin.as_view(), name='Adminlogin'),
         path('get-admin/', GetAdmin.as_view(), name='Admin'),
         path('logout/', LogoutView.as_view(), name='Logout'),
         
         
         
         
         
         
]