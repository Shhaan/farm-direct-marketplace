from rest_framework import serializers
from .models import Chatmessage
from customerProfile.serializer import ProfileSerializer

class chatSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Chatmessage
        fields = '__all__'
class Chatdepthserializer(serializers.ModelSerializer):
    class Meta:
        model=Chatmessage
        fields = '__all__'
        depth=1