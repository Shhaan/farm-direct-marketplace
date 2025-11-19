from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions,status
from rest_framework.response import Response 
from .serializer import *
from customerAuth.models import Customers
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class Adminlogin(APIView):
        permission_classes = [permissions.IsAdminUser]
        def get(self, request, email):
            
            
            if not email:
                return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                queryset = Customers.objects.get(Email=email)
                serializer = AdminlistSerilizer(queryset)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Customers.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
class GetAdmin(APIView):
    permission_classes = [permissions.IsAdminUser]
    def get(self,request):
         
        
        serializer = AdminlistSerilizer(request.user)  
        return Response(serializer.data, status=status.HTTP_200_OK)
class LogoutView(APIView):
     permission_classes = [permissions.IsAuthenticated]
     def post(self, request):
           
           
                
            refresh_token = request.data.get("refresh_token")
         
            token = RefreshToken(refresh_token)
            token.blacklist()
             
            return Response(status=status.HTTP_205_RESET_CONTENT)
        