from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
router = DefaultRouter()
router.register(r"cropcrud", Cropcrud, basename='category')
urlpatterns =  [
          
         path('crop/',Farmercrop.as_view(),name='farmercrop'),
         path('cropadd/',Farmercropadd.as_view(),name='farmercrop'),
         path('cropedit/<int:id>/',CropEditcrud.as_view(),name='farmercrop'),
         path('cropimgall/<int:id>/',Farmercropimgall.as_view(),name='farmercrop'),


         path('',include(router.urls)),
         path('orders/', FarmerOrders.as_view(), name='farmer_orders'),
         path('approve-order/<int:id>/', FarmerOrders.as_view(), name='farmer_orders'),
         path('follower/', FarmerFollower.as_view(), name='farmer_follower'),
         path('follower/<int:id>/', FarmerFollower.as_view(), name='farmer_follower'),

      
    
    
]
