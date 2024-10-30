from django.db import migrations
from django.contrib.auth.models import User, Group

def create_users_and_roles(apps, schema_editor):
    # Crear grupos (roles) si no existen
    gerente_group, created = Group.objects.get_or_create(name='Gerente')
    cajero_group, created = Group.objects.get_or_create(name='Cajero')

    # Crear usuario Gerente
    gerente_user, created = User.objects.get_or_create(username='gerente')
    if created:
        gerente_user.set_password('gerente')
        gerente_user.is_staff = True  # Opcional: acceso al admin
        gerente_user.save()
        gerente_user.groups.add(gerente_group)

    # Crear usuario Cajero
    cajero_user, created = User.objects.get_or_create(username='cajero')
    if created:
        cajero_user.set_password('cajero')
        cajero_user.is_staff = True  # Opcional: acceso al admin
        cajero_user.save()
        cajero_user.groups.add(cajero_group)

def delete_users_and_roles(apps, schema_editor):
    # Eliminar los usuarios y grupos creados en esta migración si se revierte
    User.objects.filter(username='gerente').delete()
    User.objects.filter(username='cajero').delete()
    Group.objects.filter(name='Gerente').delete()
    Group.objects.filter(name='Cajero').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),  # Ajusta si es necesario según tu versión de Django
    ]

    operations = [
        migrations.RunPython(create_users_and_roles, delete_users_and_roles),
    ]
