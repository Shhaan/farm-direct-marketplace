from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView,ListAPIView
from rest_framework import permissions,status
from rest_framework.response import Response 
from rest_framework.viewsets import ModelViewSet
from .serializer import *
from farmerAuth.models import *
from AdminMain.models import Category
from .permision import IsStaffUser
from django.db.models import *
from customerProfile.serializer import CropSerializer
from farmerMain.models import Crops
from customerProfile.models import follower
from rest_framework.parsers import MultiPartParser, FormParser
from AdminMain.pagination import CustomPagination
# Create your views here.

class Farmercrop(APIView):
    permission_classes = [IsStaffUser]
    def get(self,request):
        
        crop = Crops.objects.filter(farmer =Farmers.objects.get(user=request.user))
        serializers = CropSerializer(crop,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
class Cropcrud(ModelViewSet):
    permission_classes = [IsStaffUser]
     
    queryset = Crops.objects.all().order_by('-id')
    serializer_class = CropSerializer

class Farmercropimgall(RetrieveAPIView):
    queryset = Crops.objects.all()
    serializer_class = Cropseri
    permission_classes = [IsStaffUser]
    lookup_field = 'id'

class Farmercropadd(APIView):
    permission_classes = [IsStaffUser]
    parser_classes = [MultiPartParser,FormParser]
    def post(self,request): 
        farmer = Farmers.objects.filter(user = request.user).first()
        category = Category.objects.get(id=request.data['category'])
        images = request.FILES.getlist('image')
        data = {'farmer':farmer,'category':category,'cropName':request.data['cropName'],'price':request.data['price'],'quantity':request.data['quantity'],'About':request.data['About']}
 
        crop = Crops.objects.create(**data)
        for img in images:
            Cropimage.objects.create(crop=crop,image=img)
        serilizer = CropSerializer(crop)
        return Response(serilizer.data,status=status.HTTP_201_CREATED)

class FarmerOrders(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        farmer = Farmers.objects.get(user=request.user)
        orders = orders  = Order.objects.annotate(item_count=Count('order_items')).filter(item_count__gt=0,farmer=farmer)
        serializer = OrderserializerFarmer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):

        try:
            order = Order.objects.get(id=id)
            if order.farmer_accept:
                return Response({"error": "Order already approved"}, status=status.HTTP_400_BAD_REQUEST)
            order.farmer_accept = True
            order.save()
            serializer = OrderserializerFarmer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FarmerFollower(APIView):
    permission_classes = [IsStaffUser]
    def get(self,request):
        farmer = Farmers.objects.get(user=request.user)
        followe = follower.objects.filter(farmer=farmer)
        if not followe:
            return Response({"error":"No follower found for this farmer"},status=status.HTTP_404_NOT_FOUND)
        serializer = FollowerSerializer(followe,many=True)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(followe,request)
        if page is not None:
            serializer = FollowerSerializer(page,many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def delete(self,request,id):
        farmer = Farmers.objects.get(user=request.user)
        follo = follower.objects.get(id=id,farmer=farmer)
        follo.delete()
        return Response({"message":"Follower removed successfully"},status=status.HTTP_200_OK)


