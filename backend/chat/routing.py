from django.urls import path
from .consumer import ChatConsumer
websocket_urlpatterns =[
    path("ws/chat/<int:s_id>/<int:r_id>/", ChatConsumer.as_asgi())
]