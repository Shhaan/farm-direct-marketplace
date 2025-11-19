from django.db import models
from farmerAuth.models import Farmers
from AdminMain.models import Category
from customerAuth.models import Customers
from django.utils.text import slugify
# Create your models here.
import random
import string
    
class Crops(models.Model):
    cropName =  models.CharField(max_length=50)
    price = models.IntegerField()
    quantity = models.IntegerField()
    About =models.TextField()
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='category')
    farmer = models.ForeignKey(Farmers, on_delete=models.CASCADE,related_name='farmer')
    createdAt = models.DateField(auto_now=False, auto_now_add=True)
    quickSale = models.BooleanField(default=False)
    isDelete = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, blank=True,null=True)
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.cropName)
            random_part = ''.join(random.choices(string.ascii_lowercase, k=7))
            self.slug = f"{base_slug}-{random_part}"
        super().save(*args, **kwargs)   
    def __str__(self) -> str:
        return self.cropName
class Cropreview(models.Model):
    crop = models.ForeignKey(Crops, on_delete=models.CASCADE)
    user = models.ForeignKey(Customers, on_delete=models.CASCADE)
    review = models.TextField()
    def __str__(self) -> str:
        return self.crop.cropName +' ' + self.user.First_name +'s' + 'Review'

class Cropimage(models.Model):
    image = models.ImageField(upload_to='crops/')
    crop = models.ForeignKey(Crops,on_delete=models.CASCADE,related_name='image')
    def __str__(self) -> str:
        return self.crop.cropName