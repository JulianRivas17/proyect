from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar el grupo del usuario al token
        if user.groups.exists():
            token['group'] = user.groups.first().name  # Solo devuelve el primer grupo del usuario
        else:
            token['group'] = None  # Si el usuario no tiene grupo

        return token
