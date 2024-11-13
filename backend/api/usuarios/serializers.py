from django.contrib.auth.models import User, Group
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    # Campo para los roles (grupos)
    roles = serializers.ListField(
        child=serializers.CharField(),
        write_only=True  # Solo para escritura
    )
    assigned_roles = serializers.SerializerMethodField(read_only=True)
    password = serializers.CharField(write_only=True)  # Campo para la contraseña

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'roles', 'assigned_roles', 'password']

    def get_assigned_roles(self, obj):
        # Devuelve una lista de nombres de roles (grupos) asociados al usuario
        return [group.name for group in obj.groups.all()]

    def create(self, validated_data):
        # Extraemos la contraseña
        password = validated_data.pop('password')
        roles = validated_data.pop('roles', [])

        # Creamos el usuario
        user = User(**validated_data)
        user.set_password(password)  # Establece la contraseña encriptada
        user.save()

        # Asignamos los roles (grupos) al usuario
        for role_name in roles:
            group, created = Group.objects.get_or_create(name=role_name)
            user.groups.add(group)

        return user

    def update(self, instance, validated_data):
        # Extraemos los roles y la contraseña
        roles = validated_data.pop('roles', None)
        password = validated_data.pop('password', None)

        # Actualizamos los demás campos
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)

        # Si hay una contraseña nueva, la encriptamos
        if password:
            instance.set_password(password)

        instance.save()

        # Si hay cambios en los roles, actualizamos la relación
        if roles is not None:
            instance.groups.clear()  # Limpiamos los roles actuales
            for role_name in roles:
                group, created = Group.objects.get_or_create(name=role_name)
                instance.groups.add(group)

        return instance


    