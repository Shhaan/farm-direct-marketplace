from customerAuth.utils import send_otp_via_mail
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import permissions,status
from rest_framework.response import Response 
from .serializer import *
from customerAuth.serializer import *
from django.conf import settings
import stripe
from .models import *
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import check_password
from customerProfile.models import Wallet
class Registerfarmer(APIView): 
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        a = Customers._meta.get_fields()

        dataUser = {}
        for i in a:
            if i.name in request.data:
                dataUser[i.name] = request.data.get(i.name)
        dataUser['Phone_number'] = request.data.get('Phone')
        dataUser['postal_code'] = request.data.get('Zip_code')
        dataUser['is_staff'] = True
        dataUser['password'] = request.data.get('Password1')
        otp = False
        if not Farmers.objects.filter(user__Email=request.data['Email']).exists():
            
            if Customers.objects.filter(Email = request.data['Email']).exists():
                 
                c = Customers.objects.get(Email = request.data['Email'])
                c.is_staff = True
                c.save()
                Userserialize = UserSerializer(c)
                user_instance = Userserialize.instance
                 
                if check_password(dataUser['password'],c.password):
                  print(c.password,dataUser['password'])
                  pass
                else:
                  return Response({'error':'Customer exist with this mail and password not matching'}, status=status.HTTP_401_UNAUTHORIZED)
                  
            
            else:
                dataUser['otp'] = send_otp_via_mail(email=request.data['Email'])
                otp = True
                Userserialize = UserSerializer(data=dataUser)
                
           
                if Userserialize.is_valid():
                    Userserialize.save()
                    Wallet.objects.create(amount=0,user=Userserialize.instance)
                    shipping = {'First_name':dataUser['First_name'],'Last_name':dataUser['Last_name']  ,'Address':dataUser['Address'],'Country':dataUser['Country'],
                    'State':dataUser['State'],'District':dataUser['District'],'postal_code':dataUser['postal_code'],'user':Customers.objects.get(Email=Userserialize.data['Email'])}
                
                    shipserializer = ShippingAddress.objects.create(**shipping)
                    user_instance = Userserialize.instance
                else:
                    return Response(Userserialize.errors, status=status.HTTP_400_BAD_REQUEST)
                  
            Feild_serializer = FeildPhotos.objects.create(Feild_photo=request.data.get('Field_photo'))

        
            crop_instance =  CultingCrops.objects.create(Cropname = request.data.get('Cultivating_crop'))
             
            farmer_data = {
                'Location': request.data.get('Location'),
                'Date_of_birth': request.data.get('Date_of_birth'),
                'Bio': request.data.get('Bio'),
                'farmer_photo': request.data.get('farmer_photo'),
                'cultivatingCrop': crop_instance,
                'user': user_instance, 
            }
            
            # Create Farmer instance
            farmer_instance = Farmers.objects.create(**farmer_data)
            serializer = FarmerSerializer(farmer_instance)
            
            return Response({'data':serializer.data,'otp':otp}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message':'Farmer exists with this email'}, status=status.HTTP_400_BAD_REQUEST)
        
 



stripe.api_key = settings.STRIP_KEY

@api_view(['POST'])
def test_payment(request):
    test_payment_intent = stripe.PaymentIntent.create(
        amount=1000, currency='pln', 
        payment_method_types=['card'],
        receipt_email='test@example.com')
    return Response(status=status.HTTP_200_OK, data=test_payment_intent)


@api_view(['POST'])

def save_stripe_info(request):
    if request.method =='POST':
     
      data = request.data
      email = data['email']
      
      payment_method_id = data['payment_method_id']
      otp = data['otp']
       
      customer = stripe.Customer.create(
        email=email, payment_method=payment_method_id)
      
      payment_intent = stripe.PaymentIntent.create(
      customer=customer, 
      payment_method=payment_method_id,  
      currency='USD', 
      amount=50,
      confirm=True,
      return_url=f"{settings.BASE_APP_URL_FARMER}" if not otp else 'http://localhost:3000/register/otp-verification' ,
      description="Software development services")
       
      return Response(status=status.HTTP_200_OK, 
        data={
          'message': 'Success', 
          'data': {'customer_id': customer.id,'payment_intent':payment_intent,'otp':otp}}   
      )     
      

@api_view(['POST'])
def conformstrip(request):
    data = request.data.get('id')
    print(data)
    stripe.PaymentIntent.confirm(
      data,
      return_url=settings.BASE_APP_URL_FARMER,
    )