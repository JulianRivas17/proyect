from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Producto, VentaProducto
from .serializers import ProductoSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.db.models import Q

class ProductoListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        nombre = request.query_params.get('nombre', None)
        categoria = request.query_params.get('categoria', None)
        sort_field = request.query_params.get('sortField', None)
        sort_order = request.query_params.get('sortOrder', None)
        
        filtros = Q()

        if nombre:
            filtros &= Q(nombre_prod__icontains=nombre)
        if categoria:
            filtros &= Q(category__icontains=categoria) 
        
        productos = Producto.objects.filter(filtros)
        
        # Aplicar el orden si se recibe
        if sort_field and sort_order:
            sort_order = '' if sort_order == 'asc' else '-' 
            productos = productos.order_by(f"{sort_order}{sort_field}")
        
        # Serializar los productos
        serializer = ProductoSerializer(productos, many=True)
        
        # Retornar los datos
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