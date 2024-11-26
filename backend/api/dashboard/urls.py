from django.urls import path
from .views import ChartDataView

urlpatterns = [
    path('chart-data/', ChartDataView.as_view(), name='chart-data'),
]
