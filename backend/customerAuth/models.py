from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser,PermissionsMixin


class MyUserManager(BaseUserManager):
    def create_user(self, Email, password=None, **extra_fields):
         
        if not Email:
            raise ValueError("Users must have an email address")

        user = self.model(
            Email=self.normalize_email(Email).lower(),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, Email, password=None, **extra_fields):
        user = self.create_user( Email,  password=password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        
        user.save(using=self._db)
        return user

class Customers(AbstractBaseUser,PermissionsMixin):
    First_name = models.CharField(max_length=50,null=False)
    Last_name = models.CharField(max_length=50)
    Email = models.EmailField(max_length=254,null=False,blank=False,unique=True)
    Phone_number = models.BigIntegerField(null=True)
    is_blocked =  models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    Address = models.TextField(null=True)
    Country = models.CharField(max_length=50,null=True)
    State = models.CharField(max_length=50,null=True)
    District = models.CharField(max_length=50,null=True)
    postal_code = models.IntegerField(null=True)
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(null=True,blank =True, max_length=4)
    Created_at = models.DateField(auto_now=False, auto_now_add=True)
    REGISTRATION_CHOICES = [
        ('email', 'Email'),
        ('google', 'Google'),
    ] 
    
    registration_method = models.CharField(
        max_length=10,
        choices=REGISTRATION_CHOICES,
        default='email'
    )
    objects = MyUserManager()
    
    USERNAME_FIELD = "Email"
    REQUIRED_FIELDS = ["Phone_number","First_name"]

    def __str__(self):
        return self.Email

