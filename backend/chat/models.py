from django.db import models
from customerAuth.models import *
# Create your models here.

class Chatmessage(models.Model):
    user = models.ForeignKey(Customers,on_delete=models.CASCADE,related_name='user')
    sender = models.ForeignKey(Customers,on_delete=models.CASCADE,related_name='sender')
    reciever = models.ForeignKey(Customers,on_delete=models.CASCADE,related_name='reciever')
    message = models.CharField(max_length=1000)
    is_read = models.BooleanField(default=False)
    date = models.DateField(auto_now_add=True)
    class Meta:
        ordering = ['date'] 

    def __str__(self) -> str:
        return f"{self.sender.First_name} - {self.reciever.First_name}"
    
  