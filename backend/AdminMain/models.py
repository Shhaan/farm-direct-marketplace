from django.db import models


class Category(models.Model):
    categoryName = models.CharField(unique=True,max_length=50)
    is_parent = models.BooleanField()
    about = models.TextField()
    parent_id = models.IntegerField(null=True,blank=True)
    categoryImg = models.ImageField(upload_to='category/')
    is_blocked = models.BooleanField(default=False)
    def __str__(self) -> str:
        return self.categoryName