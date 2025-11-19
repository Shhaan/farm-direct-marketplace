from django.db import models
from customerAuth.models import Customers


class CultingCrops(models.Model):
    Cropname = models.CharField(max_length=50,null=True)
    
    
class FeildPhotos(models.Model):
    Feild_photo = models.ImageField(upload_to='feild/',null=True)
    

class Farmers(models.Model):
    user = models.OneToOneField(Customers,related_name = 'farmers', on_delete=models.CASCADE)
    cultivatingCrop = models.ForeignKey(CultingCrops, on_delete=models.CASCADE)
    Date_of_birth = models.DateField(auto_now=False, auto_now_add=False)
    Location = models.CharField(max_length=50)
    Bio = models.TextField()
    feildPhoto  = models.ManyToManyField(FeildPhotos)
    farmer_photo = models.ImageField(upload_to='farmer/')
    is_paid = models.BooleanField(default=False)
    Can_sell = models.BooleanField(default=False) 
    def __str__(self) :
        return f"Name :{self.user.First_name}  ,Email:{self.user.Email}"
    
    

class FarmerReview(models.Model):
    farmer =  models.ForeignKey(Farmers,related_name='farmer_review',on_delete=models.CASCADE)
    review = models.TextField(null=False)
    rating = models.IntegerField(default=0)
    user = models.ForeignKey(Customers,on_delete=models.CASCADE)
    