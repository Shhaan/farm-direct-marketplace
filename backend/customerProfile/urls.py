from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
router = DefaultRouter() 

urlpatterns = [
         path("crop-review/<slug:slug>/", CropReviewview.as_view(), name='crop'), 
         path("crop/", CropCrud.as_view(), name='crop'), 
         path("crop/all/", CropAll.as_view(), name='crop'), 
         path("getshipping/", Getshipping.as_view(), name='getshipping'), 
         path("add/cart/", Cartview.as_view(), name='addcart'), 
         path("edit/cart/<int:id>/", Cartupdate.as_view(), name='editcart'), 
         path('webhooks/paypal/', ProcessWebhookView.as_view()),
         path('',include(router.urls)),
         path('edit/', EditProfile.as_view(), name='editProfile'),
         path('farmer/', Fetchfarmer.as_view(), name='Fetchfarmer'),
         path('farmer-all/', Fetchfarmerall.as_view(), name='Fetchfarmer'), 
         path('farmer-profile/<str:user__email>/', FarmerProfile.as_view(), name=' farmerprofile'),
         path('farmers-review/<str:farmermail>/', FarmerReviewview.as_view(), name=' FarmerReviewview'),
         path('isfollowing/<str:farmermail>/', Isfollowing.as_view(), name=' FarmerReviewview'), 
         path('crops/<str:farmermail>/', Farmercrop.as_view(), name=' FarmerReviewview'),         
         path('category/', Fetchcategory.as_view(), name='Fetchcategory'),
         path('crop/detail/<str:slug>/', Cropdetail.as_view(), name='cropdet'),
         path('wallet/', Walletview.as_view(), name='wallet'),
         path('follower/', Followerview.as_view(), name='follower'), 
         path('follower/edit/<int:id>/', Followerviewdelete.as_view(), name='follower'),
         path('crop/category/<str:slug>/', CropCategory.as_view(), name='cropCategory'),
         path('paypal/', Completepayment.as_view(), name='cropCategory'),
         path('category/home/', FetchcategoryHome.as_view(), name='Fetchcategory'),
         path('fetchorder/', FetchOrder.as_view(), name='fetchorder'), 
         path('complete/payment/',CompletePayment.as_view(), name='CompletePayment')   

]

 