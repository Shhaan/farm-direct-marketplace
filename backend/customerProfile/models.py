from django.db import models
from farmerMain.models import Crops
from customerAuth.models import Customers
from farmerAuth.models import Farmers
# Create your models here.
from autoslug import AutoSlugField

class Cart(models.Model):
    user = models.ForeignKey(Customers,on_delete=models.CASCADE)
    crop = models.ForeignKey(Crops,on_delete=models.CASCADE)
  
    quantity = models.PositiveIntegerField(default=1)
    def subtotal(self):
        return self.quantity * self.crop.price
    def __str__(self) -> str:
        return f"{self.user.First_name}'cart"
    

class ShippingAddress(models.Model):
    First_name = models.CharField(max_length=50,null=False)
    Last_name = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    
    Address = models.TextField(null=True)
    Country = models.CharField(max_length=50,null=True)
    State = models.CharField(max_length=50,null=True)
    District = models.CharField(max_length=50,null=True)
    postal_code = models.IntegerField(null=True)
    user = models.ForeignKey(Customers,on_delete=models.CASCADE)
    def __str__(self) -> str:
        return f"{self.user.First_name}'address"
    
class follower(models.Model):
        user = models.ForeignKey(Customers,on_delete=models.CASCADE)
        farmer = models.ForeignKey(Farmers,on_delete=models.CASCADE)
        followed_at =  models.DateField(auto_now=False, auto_now_add=True)

        class Meta:
            unique_together = ('user', 'farmer')
 
        def __str__(self) -> str:
             return f"{self.user.First_name} follow {self.farmer.user.First_name}"
        



class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
    )
    farmer = models.ForeignKey(Farmers, on_delete=models.CASCADE,related_name='farmerorder')
    user = models.ForeignKey(Customers, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150)
    created_at = models.DateField(auto_now_add=True)
    paid = models.BooleanField(default=False, null=True)
    paid_amount = models.CharField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    slug = AutoSlugField(populate_from="first_name", max_length=50, unique=True)
    total = models.CharField(max_length=260)
    shipping_address = models.ForeignKey(
        ShippingAddress, on_delete=models.SET_NULL, null=True, blank=True
    )
    farmer_accept = models.BooleanField(default=False)
    PAYMENT_METHOD_CHOICES = (
        ("Cash on delivery", "Cash on Delivery"),
        ("wallet", "Wallet  payment"),
        ("paypal", "PayPal"),
    )

    is_deleted = models.BooleanField(default=False)

    payment_method = models.CharField(
        max_length=50, choices=PAYMENT_METHOD_CHOICES, null=True
    )
   

    def __str__(self):
        return "order for " + self.user.First_name + " |   Email :  " + self.user.Email
     

class Orderitem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="order_items"
    )
    crop = models.ForeignKey(Crops, on_delete=models.CASCADE)
    sub_total = models.CharField()
    quantity = models.IntegerField(default=1)
    slug = AutoSlugField(populate_from="order", max_length=50, unique=True)
  
    total = models.CharField(null=True)

    def __str__(self):
        return (
            " order item  for  "
            + self.order.user.First_name
            + "  product is  "
            + self.crop.cropName
        )
 
class Wallet(models.Model):
    amount  = models.IntegerField()
    user = models.ForeignKey(Customers, on_delete=models.CASCADE)
    def __str__(self):
        return (
            'wallet for ' + self.user.First_name
        )