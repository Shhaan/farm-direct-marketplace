from django.urls import path
from .views import * 


urlpatterns =  [
         path('register/', Registerfarmer.as_view(), name='Registerfarmer'),
       
       
       
       
         path('test-payment/', test_payment, name='teststrip'),
         path('save-stripe-info/', save_stripe_info, name='savestrip'),
         
         path('confirm-payment/', conformstrip, name='confirmstrip'),
         
         

      
    
]

 