from django.urls import path

from api.roles.views import GroupListView


urlpatterns = [
    path('listar-grupos/', GroupListView.as_view(), name='listar-grupos'),
]
