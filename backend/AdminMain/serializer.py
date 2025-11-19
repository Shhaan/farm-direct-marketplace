from rest_framework import serializers
from .models import Category
from customerProfile.serializer import *
from customerProfile.models import Order, Orderitem

class CategorySerilizer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields= '__all__'
    def validate_categoryName(self,data):
        if Category.objects.filter(categoryName = data).exists():
            print(data)
       
        return data

class OrderItemDetailSerializer(serializers.ModelSerializer):
    crop = CropSerializer()
    class Meta:
        model = Orderitem
        fields = '__all__'
        

class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    farmer = FarmerSerializer()
    user = ProfileSerializer()

    class Meta:
        model = Order
        fields = ['id', 'farmer', 'user', 'paid', 'total', 'paid_amount', 'status', 'created_at', 'order_items','farmer_accept']

    def get_order_items(self, obj):
        order_items = Orderitem.objects.filter(order=obj)
        return OrderItemDetailSerializer(order_items, many=True).data

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance


