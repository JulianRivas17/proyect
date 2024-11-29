from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.usuarios.serializers import UserSerializer
from rest_framework import status
from django.db.models import Q
from rest_framework.permissions import AllowAny
from django.utils.crypto import get_random_string
from django.core.cache import cache
from django.core.mail import send_mail
class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener parámetros opcionales de la solicitud
        email = request.query_params.get('email', None)
        sort_field = request.query_params.get('sortField', None)
        sort_order = request.query_params.get('sortOrder', None)
        
        # Filtros
        filtros = Q()

        if email:
            filtros &= Q(email__icontains=email)
        
        # Obtener los usuarios con los filtros
        users = User.objects.filter(filtros)
        
        # Aplicar el orden si se recibe
        if sort_field and sort_order:
            sort_order = '' if sort_order == 'asc' else '-' 
            users = users.order_by(f"{sort_order}{sort_field}")
        
        # Serializar los usuarios
        serializer = UserSerializer(users, many=True)
        
        # Retornar los datos
        return Response(serializer.data)
    
class CreateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Guarda los cambios en el usuario y actualiza los roles
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            # Elimina todos los registros en la tabla intermedia `auth_user_groups` para el usuario
            user.groups.clear()
            
            # Elimina al usuario
            user.delete()
            
            return Response({"message": "Usuario eliminado exitosamente"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class SendResetPasswordEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "El correo electrónico es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado con ese correo."}, status=status.HTTP_404_NOT_FOUND)
        
        # Generar un código aleatorio
        reset_code = get_random_string(length=6, allowed_chars='0123456789')
        
        # Guardar el código en la caché (con una expiración de 10 minutos)
        cache.set(f"reset_code_{email}", reset_code, timeout=600)
        
        # Enviar el correo electrónico
        send_mail(
            subject="Código de recuperación de contraseña",
            message=f"Tu código de recuperación es: {reset_code}",
            from_email="no-reply@tuapp.com",
            recipient_list=[email]
        )
        
        return Response({"message": "El código de recuperación ha sido enviado al correo electrónico."}, status=status.HTTP_200_OK)


class ValidateResetCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response({"error": "El correo y el código son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        # Recuperar el código de la caché
        cached_code = cache.get(f"reset_code_{email}")
        if not cached_code:
            return Response({"error": "El código ha expirado o es inválido."}, status=status.HTTP_400_BAD_REQUEST)
        
        if cached_code != code:
            return Response({"error": "El código proporcionado es incorrecto."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el código es válido, eliminarlo de la caché para evitar reutilización
        cache.delete(f"reset_code_{email}")

        return Response({"message": "Código validado correctamente."}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not email or not new_password or not confirm_password:
            return Response({"error": "Todos los campos son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Las contraseñas no coinciden."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "La contraseña se ha restablecido correctamente."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado con ese correo."}, status=status.HTTP_404_NOT_FOUND)