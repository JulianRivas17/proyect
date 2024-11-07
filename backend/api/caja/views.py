# api/caja/views.py
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Caja
from api.caja.serializers import CajaSerializer

class CajaListView(ListAPIView):
    queryset = Caja.objects.all()
    serializer_class = CajaSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
