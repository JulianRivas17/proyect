from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncDay
from datetime import datetime
from api.models import Caja, Venta
from django.db.models import Sum, F

class ChartDataView(APIView):
    def get(self, request, *args, **kwargs):
        chart_type = request.query_params.get('chart_type', 'bar')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            start_date = '1900-01-01'
            end_date = datetime.now().strftime('%Y-%m-%d')

        if chart_type == 'bar':
            data = Venta.objects.filter(fecha__range=[start_date, end_date]) \
                .annotate(mes=TruncMonth('fecha')) \
                .values('mes') \
                .annotate(total_ventas=Sum('monto_total')) \
                .order_by('mes')

        elif chart_type == 'line':
            data = Venta.objects.filter(fecha__range=[start_date, end_date]) \
                .values('fecha') \
                .annotate(total_ventas=Sum('monto_total')) \
                .order_by('fecha')

        elif chart_type == 'donut':
            data = Venta.objects.filter(fecha__range=[start_date, end_date]) \
                .values('estado_pedido') \
                .annotate(cantidad=Count('id')) \
                .order_by('-cantidad')

        elif chart_type == 'area':
            # Filtrar las cajas usando caja_id
            data = Caja.objects.filter(id__in=Venta.objects.filter(fecha__range=[start_date, end_date])
                                       .values('caja_id')) \
                .annotate(total_ventas_annotated=Sum('total_ventas')) \
                .values('id', 'total_ventas_annotated', 'fecha_hs_aper_caja') \
                .order_by('fecha_hs_aper_caja')

            return Response({
                'chart_type': 'area',
                'data': list(data)
            })


        else:
            return Response({"error": "Invalid chart type"}, status=400)

        return Response(data, status=200)
