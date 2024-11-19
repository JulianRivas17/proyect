# urls.py
from django.urls import path
from api.caja.views import CajaListView

urlpatterns = [
    path('listar-caja/', CajaListView.as_view(), name='listar-caja'), #url listar-caja/ 
]
