from django.urls import path,include,re_path
from rest_framework.routers import DefaultRouter
from .views import *

from .consumer import ChatConsumer

urlpatterns =  [
    
    
 path('my-message/',MyInbox.as_view(),name='inbox'),

 path('get-message/<sender_id>/<reciever_id>/',GetMessages.as_view(),name='get'),


 path('send-messages/',SendMessage.as_view(),name='send'),

path('profile/<int:pk>',profileDetail.as_view())
    
    
]

 
