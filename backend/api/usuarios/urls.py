from django.urls import path
from api.usuarios.views import CreateUserView, DeleteUserView, ResetPasswordView, SendResetPasswordEmailView, UpdateUserView, UserDetailView, UserListView, ValidateResetCodeView

urlpatterns = [
    path('listar-usuarios/', UserListView.as_view(), name='listar-usuarios'),
    path('crear-usuario/', CreateUserView.as_view(), name='crear-usuario'),
    path('editar-usuario/<int:pk>/', UpdateUserView.as_view(), name='editar-usuario'),
    path('obtener-usuario/<int:pk>/', UserDetailView.as_view(), name='obtener-usuario'),
    path('eliminar-usuario/<int:pk>/', DeleteUserView.as_view(), name='eliminar-usuario'),
    path('send-code', SendResetPasswordEmailView.as_view(), name='send-reset-code'),
    path('validate-code', ValidateResetCodeView.as_view(), name='validate-reset-code'),
    path('reset', ResetPasswordView.as_view(), name='reset-password'),
]
