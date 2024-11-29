# api/serializers.py
from rest_framework import serializers
from api.models import Caja, Venta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

class CajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caja
        fields = ['id', 'estado_caja', 'fecha_hs_aper_caja', 'fecha_hs_cierre_caja', 'monto_inicial_caja', 'total_saldo_caja', 'total_ventas', 'nombre', 'total_ventas_tarjetas', 'total_ventas_efectivo']
class AbrirCajaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        monto_inicial = request.data.get('monto_inicial', None)
        nombre_caja = request.data.get('nombre', None)

        # Validar el monto inicial
        if monto_inicial is None or monto_inicial <= 0:
            return Response({"error": "El monto inicial es obligatorio y debe ser mayor a cero."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar el nombre
        if not nombre_caja:
            return Response({"error": "El nombre de la caja es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        # Crear una nueva caja con el monto inicial, el nombre y el usuario que realiza la apertura
        caja = Caja.objects.create(
            estado_caja=True,
            fecha_hs_aper_caja=timezone.now(),
            monto_inicial_caja=monto_inicial,
            total_saldo_caja=None,  # No se sabe el total de saldo al abrir
            nombre=nombre_caja,  # Guardar el nombre recibido
            usuario_apertura=request.user  # Guardar el usuario que hace la apertura
        )

        return Response({"message": "Caja abierta con éxito", "caja_id": caja.id}, status=status.HTTP_201_CREATED)
    

class CerrarCajaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, caja_id, *args, **kwargs):
        try:
            # Obtener la caja
            caja = Caja.objects.get(id=caja_id)
            
            if not caja.estado_caja:
                return Response({"error": "La caja ya está cerrada."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Obtener las ventas asociadas a la caja
            ventas = Venta.objects.filter(caja_id=caja_id)
            ventas_pagadas = ventas.filter(pago="PAGADO")
            
            # Verificar si todas las ventas han sido pagadas
            if ventas.count() != ventas_pagadas.count():
                return Response({"error": "No todas las ventas han sido pagadas."}, status=status.HTTP_400_BAD_REQUEST)

            # Calcular el total de ventas, el total de ventas con tarjeta y el total de ventas en efectivo
            total_ventas = sum(venta.monto_total for venta in ventas_pagadas)
            total_ventas_tarjetas = sum(venta.monto_total for venta in ventas_pagadas.filter(tipo_pago="TARJETA"))
            total_ventas_efectivo = sum(venta.monto_total for venta in ventas_pagadas.filter(tipo_pago="EFECTIVO"))
            
            # Calcular el saldo total de la caja
            total_saldo = caja.monto_inicial_caja + total_ventas

            # Actualizar los valores de la caja
            caja.estado_caja = False
            caja.fecha_hs_cierre_caja = timezone.now()
            caja.total_saldo_caja = total_saldo
            caja.total_ventas = total_ventas
            caja.total_ventas_tarjetas = total_ventas_tarjetas
            caja.total_ventas_efectivo = total_ventas_efectivo  # Guardar el total de ventas en efectivo
            caja.usuario_cierre = request.user  # Asignar el usuario que realiza el cierre
            caja.save()

            return Response({"message": "Caja cerrada exitosamente."}, status=status.HTTP_200_OK)

        except Caja.DoesNotExist:
            return Response({"error": "Caja no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        

class CajaAbiertaView(APIView):
    """
    Endpoint para obtener todas las cajas abiertas (estado_caja=True)
    """
    def get(self, request, *args, **kwargs):
        cajas_abiertas = Caja.objects.filter(estado_caja=True)
        
        serializer = CajaSerializer(cajas_abiertas, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CajaView(APIView):
    """
    Endpoint para obtener todas las cajas.
    """
    def get(self, request, *args, **kwargs):
        cajas = Caja.objects.all()  # Obtiene todas las cajas
        
        serializer = CajaSerializer(cajas, many=True)  # Serializa los datos
        
        return Response(serializer.data, status=status.HTTP_200_OK)  # Retorna los datos serializados

    

class ExistCajaAbiertaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Verificamos si existe al menos una caja con estado_caja = True
        caja_abierta = Caja.objects.filter(estado_caja=True).exists()
        
        # Retornamos True si existe, de lo contrario False
        return Response(caja_abierta) 