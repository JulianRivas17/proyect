# api/ventas/views.py
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Venta
from .serializers import VentaSerializer
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

class VentaCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = VentaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VentaPagination(PageNumberPagination):
    page_size = 5 # Número de ventas por página
    page_size_query_param = 'page_size'
    max_page_size = 100

class VentaListView(generics.ListAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    pagination_class = VentaPagination

    def get_queryset(self):
        # Obtenemos la consulta base (todas las ventas)
        queryset = Venta.objects.all()

        # Filtros opcionales
        fecha_inicio = self.request.query_params.get('fecha_inicio', None)
        fecha_fin = self.request.query_params.get('fecha_fin', None)
        turno = self.request.query_params.get('turno', None)
        caja_id = self.request.query_params.get('caja_id', None)
        estado_pedido = self.request.query_params.get('estado_pedido', None)

        # Filtramos por fecha de inicio y fecha de fin (si se proporcionan)
        if fecha_inicio and fecha_fin:
            queryset = queryset.filter(fecha__range=[fecha_inicio, fecha_fin])
        elif fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)
        elif fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)

        # Filtro por turno
        if turno:
            queryset = queryset.filter(turno__icontains=turno)

        # Filtro por caja_id
        if caja_id:
            queryset = queryset.filter(caja_id=caja_id)

        # Filtro por estado_pedido
        if estado_pedido:
            queryset = queryset.filter(estado_pedido__icontains=estado_pedido)

        # Ordenación opcional
        sort_field = self.request.query_params.get('sortField', None)
        sort_order = self.request.query_params.get('sortOrder', None)

        # Si se proporcionan los parámetros de ordenación
        if sort_field and sort_order:
            # Convertimos 'ascend' a '+' (positivo) y 'descend' a '-' (negativo)
            if sort_order == 'ascend':
                queryset = queryset.order_by(sort_field)
            elif sort_order == 'descend':
                queryset = queryset.order_by(f'-{sort_field}')

        return queryset


class VentaDeleteView(generics.DestroyAPIView):
    queryset = Venta.objects.all()
    lookup_field = 'id' 

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class VentaDetailUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    lookup_field = 'id'  # Usamos el campo `id` para buscar

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)