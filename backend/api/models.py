# models.py
from django.db import models
from django.contrib.auth.models import User

class Venta(models.Model):
    fecha = models.DateField()
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    turno = models.CharField(max_length=50)
    hora_venta = models.TimeField()
    estado_pedido = models.CharField(max_length=100, default="")
    pago = models.CharField(max_length=100, default="")
    facturacion = models.CharField(max_length=100, default="")
    nombre_venta = models.CharField(max_length=100, default="")
    caja = models.ForeignKey('Caja', related_name='ventas', on_delete=models.CASCADE, null=True)
    def __str__(self):
        return f"Venta {self.id} - {self.fecha}"


class Producto(models.Model):
    nombre_prod = models.CharField(max_length=100)
    precio_prod = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=500, default="")
    category = models.CharField(max_length=100, default="")
    type_prod = models.CharField(max_length=100, default="")
    image_url = models.ImageField(upload_to='productos/', blank=True, null=True)
    def __str__(self):
        return self.nombre_prod


class VentaProducto(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_prod} en venta {self.venta.id}"

class Caja(models.Model):
    estado_caja = models.BooleanField(default=False)  # True para abierta, False para cerrada
    fecha_hs_aper_caja = models.DateTimeField()
    fecha_hs_cierre_caja = models.DateTimeField(blank=True, null=True)
    monto_inicial_caja = models.DecimalField(max_digits=10, decimal_places=2)
    total_saldo_caja = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    usuario_apertura = models.ForeignKey(User, related_name='apertura_cajas', on_delete=models.SET_NULL, null=True, blank=True)
    usuario_cierre = models.ForeignKey(User, related_name='cierre_cajas', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        estado = "Abierta" if self.estado_caja else "Cerrada"
        return f"Caja {self.id} - Estado: {estado}"
