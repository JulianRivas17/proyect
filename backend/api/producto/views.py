from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Producto, VentaProducto
from .serializers import ProductoSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny

class ProductoListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductoDetailView(APIView):
    def get(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        serializer = ProductoSerializer(producto)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductoAddView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductoDeleteView(APIView):
    def delete(self, request, id):
        producto = get_object_or_404(Producto, id=id)

        # Eliminar registros relacionados en VentaProducto
        VentaProducto.objects.filter(producto=producto).delete()

        # Eliminar el producto
        producto.delete()
        return Response({'message': 'Producto eliminado con éxito'}, status=status.HTTP_204_NO_CONTENT)

class ProductoEditView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, id):
        producto = get_object_or_404(Producto, id=id)
        serializer = ProductoSerializer(producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)