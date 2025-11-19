from django.shortcuts import render
from .service import get_user_data
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import login
from rest_framework.views import APIView
from .serializers import AuthSerializer
from customerAuth.models import Customers
from rest_framework import permissions,status
from rest_framework.response import Response 
from django.http import JsonResponse
from rest_framework.decorators import api_view

from django.http import HttpResponse, JsonResponse 

# Create your views here.


class GoogleLoginApi(APIView):
    def get(self, request, *args, **kwargs): 
        
        auth_serializer = AuthSerializer(data=request.GET)
        auth_serializer.is_valid(raise_exception=True)
        
        validated_data = auth_serializer.validated_data
        user_data = get_user_data(validated_data)
         
      
         
         
        return redirect(settings.BASE_APP_URL)    
             
 
     