from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Caja
from api.caja.serializers import CajaSerializer
from rest_framework.views import APIView

class CajaListView(APIView):
    serializer_class = CajaSerializer

    def get(self, request, *args, **kwargs):
        queryset = Caja.objects.all()

        # Filtros opcionales
        estado_caja = request.query_params.get('estado', None)
        nombre = request.query_params.get('nombre', None)

        # Si se pasa 'estado_caja', lo convertimos a un booleano (True o False)
        if estado_caja is not None:
            try:
                estado_caja = estado_caja.lower() == 'true'  # Convertir 'true' o 'false' a booleano
                queryset = queryset.filter(estado_caja=estado_caja)  # Filtrar por estado_caja (booleano)
            except ValueError:
                return Response({"error": "estado_caja debe ser 'true' o 'false'"}, status=status.HTTP_400_BAD_REQUEST)

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)  # Filtro por nombre

        # Ordenación opcional
        sort_field = request.query_params.get('sortField', None)
        sort_order = request.query_params.get('sortOrder', None)

        # Si se proporcionan los parámetros de ordenación
        if sort_field and sort_order:
            # Convertimos 'ascend' a '+' (positivo) y 'descend' a '-' (negativo)
            if sort_order == 'ascend':
                queryset = queryset.order_by(sort_field)
            elif sort_order == 'descend':
                queryset = queryset.order_by(f'-{sort_field}')

        # Serializar los datos
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)