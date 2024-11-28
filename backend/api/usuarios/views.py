from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.usuarios.serializers import UserSerializer
from rest_framework import status
from django.db.models import Q

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