from django.shortcuts import render
from .serializer import chatSerializer,Chatdepthserializer
# Create your views here.
from .models import Chatmessage
from customerAuth.models import Customers
from rest_framework.generics import ListAPIView,CreateAPIView,RetrieveUpdateAPIView
 

from customerProfile.serializer import ProfileSerializer
from django.db.models import Q, F, Value, CharField
from django.db.models.functions import Concat, Cast

class MyInbox(ListAPIView):
    serializer_class = Chatdepthserializer
    
    def get_queryset(self):
        c = self.request.user
        messages = Chatmessage.objects.filter(Q(sender=c) | Q(reciever=c))
        
        # Cast IDs to CharField and concatenate them with a dash
        messages = messages.annotate(
            user_identifier=Concat(
                Cast(F('sender_id'), output_field=CharField()),
                Value('-'),
                Cast(F('reciever_id'), output_field=CharField())
            )
        )
        
        # Use DISTINCT ON with the appropriate ORDER BY
        messages = messages.order_by('user_identifier', '-id').distinct('user_identifier')
        
        return messages

class GetMessages(ListAPIView):
    serializer_class = chatSerializer
    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        reciever_id = self.kwargs['reciever_id']
        messages = Chatmessage.objects.filter(
            sender__in =[sender_id,reciever_id],
            reciever__in=[sender_id,reciever_id]
        )
     
        return messages
class SendMessage(CreateAPIView):
    serializer_class = chatSerializer

class profileDetail(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Customers.objects.all()










    # messages = Chatmessage.objects.filter(
    #         id__in=Subquery(
    #             Customers.objects.filter(
    #                 Q(sender__reciever=user_id)|
    #                 Q(reciever__sender=user_id)
    #             ).distinct().annotate(
    #                 last_msg=Subquery(
    #                     Chatmessage.objects.filter(
    #                         Q(sender=OuterRef('id'),reciever=user_id)|
    #                          Q(reciever=OuterRef('id'),sender=user_id)
    #                     ).order_by('-id')[:1].values_list('id',flat=True)
    #                 )
    #             ).values_list('last_msg',flat=True).order_by('-id')
    #         )
    #     ).order_by('-id')