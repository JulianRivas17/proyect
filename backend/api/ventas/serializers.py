from rest_framework import serializers
from api.models import Venta, VentaProducto

class VentaProductoSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source='producto.nombre_prod', read_only=True)  # Campo personalizado para el nombre del producto

    class Meta:
        model = VentaProducto
        fields = ['producto', 'nombre_producto', 'cantidad']  # Incluye el ID, nombre del producto y cantidad

class VentaSerializer(serializers.ModelSerializer):
    productos = VentaProductoSerializer(many=True, write_only=True)

    class Meta:
        model = Venta
        fields = ['id','fecha', 'monto_total', 'turno', 'hora_venta', 'productos']

    def create(self, validated_data):
        productos_data = validated_data.pop('productos')
        venta = Venta.objects.create(**validated_data)

        for producto_data in productos_data:
            VentaProducto.objects.create(
                venta=venta,
                producto=producto_data['producto'],
                cantidad=producto_data['cantidad']
            )
        return venta

    def to_representation(self, instance):
        # Serializa `productos` para incluir datos detallados al recuperar una venta
        representation = super().to_representation(instance)
        productos = VentaProducto.objects.filter(venta=instance)
        representation['productos'] = VentaProductoSerializer(productos, many=True).data
        return representation
