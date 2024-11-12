from django.urls import path
from api.usuarios.views import UserListView

urlpatterns = [
    path('listar-usuarios/', UserListView.as_view(), name='listar-usuarios'),
]
