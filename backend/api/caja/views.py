# api/caja/views.py
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Caja
from api.caja.serializers import CajaSerializer

class CajaListView(ListAPIView):
    queryset = Caja.objects.all() # el modelo   
    serializer_class = CajaSerializer # serializador

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()   # realiza la consulta y se lo pasa a serializer
        serializer = self.get_serializer(queryset, many=True) #construye la consulta en un json
        return Response(serializer.data, status=status.HTTP_200_OK)
