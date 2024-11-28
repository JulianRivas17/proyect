# urls.py
from django.urls import path
from api.caja.views import CajaListView
from api.caja.serializers import AbrirCajaView, CerrarCajaView, CajaAbiertaView, ExistCajaAbiertaView

urlpatterns = [
    path('listar-caja/', CajaListView.as_view(), name='listar-caja'),
    path('abrir-caja/', AbrirCajaView.as_view(), name='abrir-caja'),
    path('cerrar-caja/<int:caja_id>/', CerrarCajaView.as_view(), name='cerrar-caja'),  
    path('cajas-abiertas/', CajaAbiertaView.as_view(), name='cajas-abiertas'),
    path('exist-caja-abierta/', ExistCajaAbiertaView.as_view(), name='caja-abierta'),
]
