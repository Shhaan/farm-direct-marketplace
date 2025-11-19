from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(Cart)
admin.site.register(ShippingAddress)
admin.site.register(follower) 
admin.site.register(Wallet)
admin.site.register(Order)
admin.site.register(Orderitem)
