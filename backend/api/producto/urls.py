# api/producto/urls.py
from django.urls import path
from .views import ProductoAddView, ProductoDeleteView, ProductoDetailView, ProductoEditView, ProductoListView  # Asegúrate de que esta vista esté definida

urlpatterns = [
    path('', ProductoListView.as_view(), name='productos'),  # Esto permite acceder a /api/productos/
    path('productos/<int:id>/', ProductoDetailView.as_view(), name='producto-detail'),
    path('productos/add/', ProductoAddView.as_view(), name='producto-add'),
    path('productos/delete/<int:id>/', ProductoDeleteView.as_view(), name='producto-delete'),
    path('productos/<int:id>/edit/', ProductoEditView.as_view(), name='producto-edit'),  # Editar un producto

] 
