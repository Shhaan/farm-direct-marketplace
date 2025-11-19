import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from customerAuth.models import Customers
from .models import Chatmessage
from .serializer import chatSerializer
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self): 
        
        reciver_id = self.scope['url_route']['kwargs']['r_id']
        sender_user = self.scope['url_route']['kwargs']['s_id']
        user_ids = [int(reciver_id),int(sender_user)]
     
         
        user_ids =sorted(user_ids)
        self.room_group_name = f"chat_{user_ids[0] }-{user_ids[1]}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name ) 
       
        await self.accept()
    
    async def receive(self, text_data=None, bytes_data=None): 
         data = json.loads(text_data)
      
         message = data['message']
         reciver_id = self.scope['url_route']['kwargs']['r_id']
         sender_user = self.scope['url_route']['kwargs']['s_id']
         ms = await self.save_message(sender_user, reciver_id, message)
          
         await self.channel_layer.group_send(
             self.room_group_name,
             {
                 'type':'chat_message',
                 'message':chatSerializer(ms).data
             }
         )

    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def chat_message(self,event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message':message
        }))
    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        sender = Customers.objects.get(id=sender_id)
        receiver = Customers.objects.get(id=receiver_id)
        print(sender,receiver)
        chat_message = Chatmessage.objects.create(
            user=sender, 
            sender=sender, 
            reciever=receiver, 
            message=message
        )

        return chat_message
   