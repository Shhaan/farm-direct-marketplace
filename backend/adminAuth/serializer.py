from rest_framework import serializers
from customerAuth.models import Customers

class AdminlistSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        exclude = ['password']

