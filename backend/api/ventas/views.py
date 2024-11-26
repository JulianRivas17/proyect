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
    page_size = 10  # Número de ventas por página
    page_size_query_param = 'page_size'
    max_page_size = 100

class VentaListView(generics.ListAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    pagination_class = VentaPagination


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