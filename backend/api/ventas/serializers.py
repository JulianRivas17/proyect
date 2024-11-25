from rest_framework import serializers
from api.models import Venta, VentaProducto, Producto

class VentaProductoSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source='producto.nombre_prod', read_only=True)
    precio_producto = serializers.DecimalField(source='producto.precio_prod', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = VentaProducto
        fields = ['producto', 'nombre_producto', 'cantidad', 'precio_producto']

class VentaSerializer(serializers.ModelSerializer):
    productos = serializers.ListField(write_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'monto_total', 'turno', 'hora_venta', 'productos', 'estado_pedido', 'pago', 'facturacion', 'nombre_venta']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        productos = VentaProducto.objects.filter(venta=instance)
        representation['productos'] = VentaProductoSerializer(productos, many=True).data
        return representation

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])
        venta = Venta.objects.create(**validated_data)

        for producto_data in productos_data:
            VentaProducto.objects.create(
                venta=venta,
                producto_id=producto_data['producto'],
                cantidad=producto_data['cantidad']
            )

        return venta

    def update(self, instance, validated_data):
        productos_data = validated_data.pop('productos', [])

        instance.fecha = validated_data.get('fecha', instance.fecha)
        instance.monto_total = validated_data.get('monto_total', instance.monto_total)
        instance.turno = validated_data.get('turno', instance.turno)
        instance.estado_pedido = validated_data.get('estado_pedido', instance.estado_pedido)
        instance.pago = validated_data.get('pago', instance.pago)
        instance.facturacion = validated_data.get('facturacion', instance.facturacion)
        instance.nombre_venta = validated_data.get('nombre_venta', instance.nombre_venta)
        instance.save()

        existing_productos = {prod.producto_id: prod for prod in VentaProducto.objects.filter(venta=instance)}
        new_productos = {item['producto']: item for item in productos_data}

        for producto_id in list(existing_productos.keys()):
            if producto_id not in new_productos:
                existing_productos[producto_id].delete()

        for producto_id, producto_data in new_productos.items():
            if producto_id in existing_productos:
                producto = existing_productos[producto_id]
                producto.cantidad = producto_data['cantidad']
                producto.save()
            else:
                VentaProducto.objects.create(
                    venta=instance,
                    producto_id=producto_data['producto'],
                    cantidad=producto_data['cantidad']
                )

        return instance
