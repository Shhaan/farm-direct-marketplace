
from rest_framework.views import APIView
from .serializer import CurrentUser,RegisterUser
from rest_framework.generics import ListAPIView
from rest_framework import permissions,status
from rest_framework.response import Response 
from .models import Customers
from customerProfile.models import ShippingAddress,Wallet
from .utils import send_otp_via_mail

# Create your views here.


class Currentuser(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        
        try: 
            serializer = CurrentUser(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customers.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
class Registeruser(APIView):
    def post(self,request):
         
        detail = {'First_name':request.data['First_name'],'Last_name':request.data['Last_name'],'Email':request.data['Email']
                  ,'Phone_number':request.data['Phone'],'Address':request.data['Address'],'Country':request.data['Country'],
                  'password':request.data['password1'],'State':request.data['State'],'District':request.data['District'],'postal_code':request.data['Postal_code'],
                  'is_verified':True}
        
        serializer = RegisterUser(data = detail)
        
        if serializer.is_valid():
            serializer.save()
            
            Wallet.objects.create(amount=100,user=serializer.instance)
            shipping = {'First_name':request.data['First_name'],'Last_name':request.data['Last_name']  ,'Address':request.data['Address'],'Country':request.data['Country'],
                'State':request.data['State'],'District':request.data['District'],'postal_code':request.data['Postal_code'],'user':Customers.objects.get(Email=serializer.data['Email'])}
            
            shipserializer = ShippingAddress.objects.create(**shipping)
           
             
            
            
            return Response(serializer.data, 
                            status=status.HTTP_201_CREATED) 
        
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Verifyotp(APIView):
    def post(self,request):
        otp = request.data['otp']
        email = request.data['email']
        user = Customers.objects.get(Email=email)
        print(user)
        if otp == user.otp:
            user.is_verified = True
            user.save()
            serilaizer = CurrentUser(user)
            print(serilaizer.data)
            return Response(serilaizer.data,status=status.HTTP_200_OK)
        return Response({'error':'Otp verification failed'},status=status.HTTP_401_UNAUTHORIZED)
    