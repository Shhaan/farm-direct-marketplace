from rest_framework import serializers
from farmerMain.models import Crops,Cropimage,Cropreview
from farmerAuth.models import Farmers,FarmerReview
from AdminMain.models import Category
from customerAuth.models import Customers 
from .models import Cart 
from customerProfile.models import ShippingAddress,Wallet,follower,Order,Orderitem
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        exclude = ['password']


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmers
        fields = '__all__'
        depth = 1

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CropImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cropimage
        fields = ['image']

class CropSerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer()
    image = serializers.SerializerMethodField()
    category = CategorySerializer()
    class Meta:
        model = Crops
        fields = '__all__'

    def get_image(self, obj):
        image = Cropimage.objects.filter(crop=obj).first()
        if image:
            return CropImageSerializer(image).data
        return None 

class Cropreviewserilaizer(serializers.ModelSerializer): 
       class Meta:
           model = Cropreview
           fields = '__all__'
           depth = 1

class Cartserilazer(serializers.ModelSerializer):
    crop = CropSerializer()
    user = ProfileSerializer()
    class Meta:
        model = Cart
        fields = '__all__'
class ShipaddresSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = ShippingAddress
        fields = '__all__'
    def validate(self, attrs):
        return attrs    
    def create(self, validated_data):
        return ShippingAddress.objects.create(**validated_data)

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'
        depth = 1

     
class FollowerSerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer()
    user = ProfileSerializer()
    class Meta:
        model = follower
        fields = '__all__' 
    def validate(self, attrs):
         
        return attrs

class Orderserializer(serializers.ModelSerializer):
    user = ProfileSerializer()
    farmer = FarmerSerializer()
    class Meta:
        model = Order
        fields='__all__'

class OrderItemserializer(serializers.ModelSerializer):
    order = Orderserializer()
    crop = CropSerializer()
    class Meta:
        model = Orderitem
        fields='__all__'


class FarmerReviewserializer(serializers.ModelSerializer):
    user = ProfileSerializer()
    farmer = FarmerSerializer()
    class Meta:
        model = FarmerReview
        fields = '__all__'

 
class CropSerializernew(serializers.ModelSerializer):
     
    image = serializers.SerializerMethodField()
    category = CategorySerializer()
    class Meta:
        model = Crops
        fields = '__all__'

    def get_image(self, obj):
        image = Cropimage.objects.filter(crop=obj).first()
        if image:
            return CropImageSerializer(image).data
        return None 