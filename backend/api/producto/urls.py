# api/producto/urls.py
from django.urls import path
from .views import ProductoListView  # Asegúrate de que esta vista esté definida

urlpatterns = [
    path('', ProductoListView.as_view(), name='productos'),  # Esto permite acceder a /api/productos/
]
