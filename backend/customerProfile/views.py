 
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,RetrieveAPIView,RetrieveUpdateDestroyAPIView,RetrieveUpdateAPIView
from rest_framework import permissions,status
from rest_framework.response import Response  
from .serializer import *
from farmerAuth.models import *
from AdminMain.models import Category
from .models import *
from django.db.models import *
from farmerMain.serializer import Cropseri
from farmerMain.models import *
import json
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from rest_framework.exceptions import NotFound
from paypalrestsdk import notifications
# Create your views here.

class EditProfile(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self,request):
        serializer  = ProfileSerializer(request.user,data=request.data)
        if serializer.is_valid():
             serializer.save() 
             return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class CropCrud(APIView):
     

    def get(self,request):
        query = Crops.objects.all()[:4] 
        serializersImg = CropSerializer(query,many=True) 
        return Response(serializersImg.data)

class CropAll(ListAPIView): 
    queryset = Crops.objects.all()
    serializer_class = CropSerializer 
class Fetchfarmer(APIView): 
    def get(self,request): 
        farmer = Farmers.objects.prefetch_related(
            Prefetch('farmer', queryset=Crops.objects.all())
        ).filter(farmer__isnull=False).distinct()
        serializers = FarmerSerializer(farmer,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class Fetchfarmerall(APIView):
    def get(self,request): 
        farmer = Farmers.objects.all()
        serializers = FarmerSerializer(farmer,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    

 
class FarmerProfile(RetrieveAPIView):
    serializer_class = FarmerSerializer

    def get_object(self):
        email = self.kwargs['user__email']
      
        return  Farmers.objects.get( user__Email=email)
class Fetchcategory(APIView):
    def get(self,request):  

         
        categories = Category.objects.filter(is_parent=True).distinct()
        serializers = CategorySerializer(categories,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class FetchcategoryHome(APIView):
    def get(self,request): 
        category = Category.objects.filter() 
        serializers = CategorySerializer(category,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    def post(self,request):
        category = Category.objects.filter() 
        serializers = CategorySerializer(category,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
class Cropdetail(RetrieveAPIView):
    queryset = Crops.objects.all()
    serializer_class = Cropseri 
    lookup_field = 'slug'
class CropReviewview(APIView): 
    def get(self,request,slug):
        review = Cropreview.objects.filter(crop__slug=slug)
        serializer = Cropreviewserilaizer(review,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
     

class Cartview(APIView):
    permission_classes =[permissions.IsAuthenticated]
    def get(self,request):

        cart=Cart.objects.filter(user=request.user)

        serializer = Cartserilazer(cart,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def post(self,request): 
        slug = request.data.get('slug')
        quantity = request.data.get('quantity')
        crop = Crops.objects.get(slug=slug)
        cropexist= Cart.objects.filter(Q(user=request.user)&Q(crop=crop))
        if cropexist.exists():
            cropexist.update(quantity=F("quantity") + quantity)
            serializers = Cartserilazer(cropexist.first()) 
        else: 
            cart = Cart.objects.create(user=request.user,crop=crop,quantity=quantity)
            serializers = Cartserilazer(cart)
        return Response(serializers.data,status=status.HTTP_201_CREATED)
class Cartupdate(RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = Cartserilazer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
class Getshipping(APIView):
    permission_classes =[permissions.IsAuthenticated]

    def get(self,request): 
        user = request.user
        shipad = ShippingAddress.objects.filter(user=user)
        serializer = ShipaddresSerializer(shipad,many=True)
        if serializer.data:
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.data,status=status.HTTP_204_NO_CONTENT)
    def post(self,request):
        data = request.data
        data['user'] = request.user.id
        serializer = ShipaddresSerializer(data=data)    
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


class Walletview(ListAPIView):
    serializer_class = WalletSerializer
    permission_classes=[permissions.IsAuthenticated]
    
    def get_queryset(self):
        wallet = Wallet.objects.filter(user=self.request.user)

        return wallet     

 
@method_decorator(csrf_exempt, name="dispatch")
class ProcessWebhookView(View):
    def post(self, request):
        if "HTTP_PAYPAL_TRANSMISSION_ID" not in request.META:
            
            return HttpResponseBadRequest()
 
        auth_algo = request.META['HTTP_PAYPAL_AUTH_ALGO']
        cert_url = request.META['HTTP_PAYPAL_CERT_URL']
        transmission_id = request.META['HTTP_PAYPAL_TRANSMISSION_ID']
        transmission_sig = request.META['HTTP_PAYPAL_TRANSMISSION_SIG']
        transmission_time = request.META['HTTP_PAYPAL_TRANSMISSION_TIME']
        webhook_id = settings.PAYPAL_WEBHOOK_ID
        event_body = request.body.decode(request.encoding or "utf-8")
 
        valid = notifications.WebhookEvent.verify(
            transmission_id=transmission_id,
            timestamp=transmission_time,
            webhook_id=webhook_id,
            event_body=event_body,
            cert_url=cert_url,
            actual_sig=transmission_sig,
            auth_algo=auth_algo,
        )
 
        if not valid:
            return HttpResponseBadRequest()
 
        webhook_event = json.loads(event_body)
 
        event_type = webhook_event["event_type"]
 
 
        return HttpResponse()
class Followerview(ListAPIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = FollowerSerializer
    def get_queryset(self):
        
        followers = follower.objects.filter(user=self.request.user)

        return followers 
class Followerviewdelete(RetrieveUpdateDestroyAPIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = FollowerSerializer
    queryset = follower.objects.all()
    lookup_field = 'id'
    


class CropCategory(APIView):
    def get(self,request,slug):
        
        flag = request.GET.get('category',False)

        if flag =='true':
             
            category = Category.objects.get(categoryName=slug)
            id = category.id 

            query = Crops.objects.filter(category__parent_id=id)  
     
        else:
            query = Crops.objects.filter(farmer__user__First_name = slug)
            
        s = CropSerializer( query,many=True)

        return Response(s.data,status=status.HTTP_200_OK)

class Completepayment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self,request):
        detail = request.data['details']
        items = detail['purchase_units'][0]['items'][0]
        shipping = request.data['shipping']
        print(request.data)
        if 'id' in shipping.keys():
            
            address = ShippingAddress.objects.get(id = int(shipping['id']))
            
            order = Order.objects.create(farmer=Farmers.objects.get(id=int(request.data['farmer'])),user=request.user,shipping_address = address,first_name = request.user.First_name,
                                 paid=True,paid_amount = items['unit_amount']['value'],payment_method='paypal')
        else:
            address = ShippingAddress.objects.create(**shipping,user=request.user)
            order = Order.objects.create(farmer=Farmers.objects.get(id=int(request.data['farmer'])),user=request.user,shipping_address = address,first_name = request.user.First_name,
                                 paid=True,paid_amount = items['unit_amount']['value'],payment_method='paypal')
        
        crop =Crops.objects.get(id=request.data['productid'])
        Cart.objects.filter(crop=crop,user=request.user).delete()
        Orderitem.objects.create(order = order,crop=crop,quantity = items['quantity'],sub_total=items['unit_amount']['value'],total =str(float(items['unit_amount']['value'])*int(items['quantity'])))
        crop.quantity = crop.quantity -  items['quantity']
        crop.save()      
        return Response({'data':'created'},status=status.HTTP_201_CREATED)
    
class FetchOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        id = request.GET.get('id')
         
        if id:
            try:
                order = Orderitem.objects.get(order__id = id)
                serialzer = OrderItemserializer(order)
                return Response(serialzer.data,status=status.HTTP_200_OK)
            except Orderitem.DoesNotExist:
                raise NotFound({"error":"No order with this id"})
        else:
            order = Orderitem.objects.filter(order__user = request.user)
         
        serialzer = OrderItemserializer(order,many=True)
        return Response(serialzer.data,status=status.HTTP_200_OK)

class CompletePayment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request): 
        shipping = request.data['shipping']
        products = request.data['products']
        if 'id' in shipping.keys():
            
            address = ShippingAddress.objects.get(id = int(shipping['id']))
            
            order = Order.objects.create(farmer=Farmers.objects.get(id=int(products['farmer'])),user=request.user,shipping_address = address,first_name = request.user.First_name,
                                 paid=True,paid_amount = products['price'],payment_method=request.data['paymentmethod'])
        else:
            address = ShippingAddress.objects.create(**shipping,user=request.user)
            order = Order.objects.create(farmer=Farmers.objects.get(id=int(products['farmer'])),user=request.user,shipping_address = address,first_name = request.user.First_name,
                                 paid=True,paid_amount = products['price'],payment_method=request.data['paymentmethod'])
             
        crop =Crops.objects.get(id=products['productid'])

        Orderitem.objects.create(order = order,crop=crop,quantity = products['quantity'],sub_total=products['price'],total =str(int(products['quantity'])*float(products['price'])))
        Cart.objects.filter(crop=crop,user=request.user).delete()
        crop.quantity = crop.quantity -  products['quantity']
        crop.save()
        return Response({'data':'created'},status=status.HTTP_201_CREATED )


class FarmerReviewview(ListAPIView):
    serializer_class = FarmerReviewserializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            farmer = Farmers.objects.get(user__Email = self.kwargs['farmermail'])

        except Farmers.DoesNotExist:
            raise NotFound({"error":'No farmer with this mail'})
        return FarmerReview.objects.filter(farmer=farmer)

class Isfollowing(APIView):
    permission_classes  = [permissions.IsAuthenticated]

    def get(self,request,farmermail):
         
        try:
            f = follower.objects.get(user=request.user,farmer=Farmers.objects.get(user__Email=farmermail))
        except follower.DoesNotExist:
            return Response({'isFollowing':False},status=status.HTTP_204_NO_CONTENT)
        return Response({'isFollowing':True},status=status.HTTP_200_OK)
        
    def delete(self,request,farmermail):

        try:
            f = follower.objects.get(user=request.user,farmer=Farmers.objects.get(user__Email=farmermail))
            f.delete()
            return Response({'isFollowing': False}, status=status.HTTP_200_OK)
        except follower.DoesNotExist:
            follower.objects.create(user=request.user,farmer=Farmers.objects.get(user__Email=farmermail))
            return Response({'isFollowing':True},status=status.HTTP_200_OK)
        
class Farmercrop(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CropSerializernew
    def get_queryset(self):
        return Crops.objects.filter(farmer=Farmers.objects.get(user__Email= self.kwargs['farmermail']))
