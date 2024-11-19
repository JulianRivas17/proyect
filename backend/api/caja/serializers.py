# api/serializers.py
from rest_framework import serializers
from api.models import Caja

class CajaSerializer(serializers.ModelSerializer):#serializador basado en un modelo
    class Meta:
        model = Caja
        fields = ['id', 'estado_caja', 'fecha_hs_aper_caja', 'fecha_hs_cierre_caja', 'monto_inicial_caja', 'total_saldo_caja']
