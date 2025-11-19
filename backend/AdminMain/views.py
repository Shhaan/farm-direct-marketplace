from django.shortcuts import render
from rest_framework import viewsets
from .models import Category
from .serializer import *
from rest_framework.views import APIView
from rest_framework import permissions,status
from rest_framework.generics import ListAPIView,RetrieveAPIView

from rest_framework.response import Response 
from django.db.models import Q, Count
from customerProfile.serializer import *
from farmerAuth.models import Farmers
from customerAuth.models import Customers
from farmerMain.permision import IsStaffUser
from .pagination import CustomPagination
from customerProfile.models import Order, Orderitem

# Create your views here.

class CategoryCrud(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Category.objects.all().order_by('-id')
    serializer_class = CategorySerilizer

class CategoryPartialDelete(APIView):
    def patch(self, request, id):
        is_blocked = request.data.get('is_blocked')
        
        if is_blocked:
            
            category = Category.objects.filter(Q(id=id)).update(is_blocked=False)
            
            
        else:
            category = Category.objects.filter(Q(id=id)|Q(parent_id=id)).update(is_blocked=True)
        
        category = Category.objects.all()
            
        serializer = CategorySerilizer(category,many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class Fetchfarmer(APIView):
    permission_classes = [permissions.IsAdminUser]
    def get(self,request):
        farmer = Farmers.objects.all()
        serializers = FarmerSerializer(farmer,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    

class Fetchcustomer(APIView):
    permission_classes = [permissions.IsAdminUser]
    def get(self,request):
        customer = Customers.objects.all()
        serializers = ProfileSerializer(customer,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
class FarmerOrders(ListAPIView):
    permission_classes = [IsStaffUser]
    serializer_class = OrderItemserializer 
    pagination_class = CustomPagination
    queryset = Orderitem.objects.all().order_by('-id')

class FarmerOrdersdetails(RetrieveAPIView):
    permission_classes = [IsStaffUser]
    serializer_class = OrderItemserializer 
    queryset = Orderitem.objects.all().order_by('-id')
    lookup_field = 'id'

class AdminOrderList(APIView):
    permission_classes = [permissions.IsAdminUser]
    pagination_class = CustomPagination()

    def get(self, request):
        # Fetch orders that have at least one order item
        orders  = Order.objects.annotate(item_count=Count('order_items')).filter(item_count__gt=0)
        
        # Paginate the results
        page = self.pagination_class.paginate_queryset(orders, request)
        if page is not None:
            serializer = OrderSerializer(page, many=True)
            return self.pagination_class.get_paginated_response(serializer.data)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminOrderDetail(RetrieveAPIView):
    permission_classes = [IsStaffUser]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    lookup_field = 'id'

class AdminOrderStatusUpdate(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, id):
        try:
            order = Order.objects.get(id=id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['pending', 'completed']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

