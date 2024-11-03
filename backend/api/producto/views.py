# api/producto/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Producto
from .serializers import ProductoSerializer

class ProductoListView(APIView):
    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

