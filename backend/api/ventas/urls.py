# api/ventas/urls.py
from django.urls import path
from .views import VentaCreateView, VentaDeleteView, VentaListView

urlpatterns = [
    path('crear-venta/', VentaCreateView.as_view(), name='crear_venta'),
    path('listar-ventas/', VentaListView.as_view(), name='listar_ventas'),
    path('<int:id>/eliminar/', VentaDeleteView.as_view(), name='eliminar_venta'),
]
