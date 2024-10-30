# api/migrations/0003_load_initial_products.py
from django.db import migrations

def load_initial_products(apps, schema_editor):
    # Obtener el modelo Producto
    Producto = apps.get_model('api', 'Producto')

    # Crear productos típicos argentinos con precios en pesos argentinos
    productos = [
        {"nombre_prod": "Milanesa con Papas Fritas", "precio_prod": 1200.00},
        {"nombre_prod": "Empanada de Carne", "precio_prod": 180.00},
        {"nombre_prod": "Empanada de Jamón y Queso", "precio_prod": 180.00},
        {"nombre_prod": "Choripán", "precio_prod": 600.00},
        {"nombre_prod": "Pizza de Muzzarella", "precio_prod": 800.00},
        {"nombre_prod": "Pizza Napolitana", "precio_prod": 950.00},
        {"nombre_prod": "Ensalada Rusa", "precio_prod": 450.00},
        {"nombre_prod": "Fugazzeta", "precio_prod": 900.00},
        {"nombre_prod": "Parrillada para Dos", "precio_prod": 3000.00},
        {"nombre_prod": "Flan con Dulce de Leche", "precio_prod": 350.00},
        {"nombre_prod": "Coca-Cola", "precio_prod": 250.00},
        {"nombre_prod": "Agua Mineral", "precio_prod": 200.00},
        {"nombre_prod": "Café con Leche", "precio_prod": 300.00},
        {"nombre_prod": "Medialuna", "precio_prod": 100.00},
        {"nombre_prod": "Alfajor", "precio_prod": 120.00},
    ]
    
    # Crear instancias de Producto y guardarlas en la base de datos
    for prod_data in productos:
        Producto.objects.create(**prod_data)

def unload_initial_products(apps, schema_editor):
    # Este método es opcional y permite revertir los cambios en caso de ser necesario
    Producto = apps.get_model('api', 'Producto')
    Producto.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_initial'),  # Asegúrate de que esta dependencia esté correctamente configurada
    ]

    operations = [
        migrations.RunPython(load_initial_products, reverse_code=unload_initial_products),
    ]
