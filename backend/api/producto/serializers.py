from rest_framework import serializers
from api.models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    precio_prod = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Producto
        fields = ['id', 'nombre_prod', 'precio_prod', 'image_url']
