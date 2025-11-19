from rest_framework import serializers
from .models import *
from customerAuth.models import Customers 



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = '__all__'
    def validate(self, data):
        if self.instance is None and Customers.objects.filter(Email=data['Email']).exists():
            raise serializers.ValidationError('Email already exists')
        return data
    def create(self, validated_data):
        
        
        return Customers.objects.create_user(**validated_data)





        
class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = CultingCrops
        fields = '__all__'
        
class FeildPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeildPhotos
        fields = '__all__'
         
        
class FarmerSerializer(serializers.ModelSerializer):
    cultivatingCrop = CropSerializer()
    user = UserSerializer()
    feildPhoto = FeildPhotoSerializer()
    class Meta:
        model = Farmers
        fields = '__all__'
  
        

