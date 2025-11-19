from rest_framework import serializers
from .models import Customers
from django.contrib.auth.hashers import make_password
from customerProfile.models import ShippingAddress
class CurrentUser(serializers.ModelSerializer):
    class Meta:
        model = Customers
        exclude = ['password']
         
class RegisterUser(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = '__all__'
        
    def validate(self,data):
        if Customers.objects.filter(Email=data['Email']).exists():
            raise serializers.ValidationError('Email already exist')
        return data
    def create(self, validated_data):
        
        
        return Customers.objects.create_user(**validated_data)
 