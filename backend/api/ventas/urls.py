# api/ventas/urls.py
from django.urls import path
from .views import VentaCreateView, VentaDeleteView, VentaListView, VentaDetailUpdateView, VentaSearchViewCode

urlpatterns = [
    path('crear-venta/', VentaCreateView.as_view(), name='crear_venta'),
    path('listar-ventas/', VentaListView.as_view(), name='listar_ventas'),
    path('<int:id>/eliminar/', VentaDeleteView.as_view(), name='eliminar_venta'),
    path('<int:id>/detalle/', VentaDetailUpdateView.as_view(), name='detalle_venta'),
    path('listar-ventas-code/', VentaSearchViewCode.as_view(), name='listar_ventas'),
]
