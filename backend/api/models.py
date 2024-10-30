# models.py
from django.db import models

class Venta(models.Model):
    fecha = models.DateField()
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    turno = models.CharField(max_length=50)
    hora_venta = models.TimeField()

    def __str__(self):
        return f"Venta {self.id} - {self.fecha}"


class Producto(models.Model):
    nombre_prod = models.CharField(max_length=100)
    precio_prod = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre_prod


class VentaProducto(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_prod} en venta {self.venta.id}"
