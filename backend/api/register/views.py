from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes  # Asegúrate de importar permission_classes
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])  
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
