from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from api.register.views import register_user
from api.login.views import CustomTokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('ventas/', include('api.ventas.urls')), 
    path('productos/', include('api.producto.urls')),
    path('caja/', include('api.caja.urls')),
    path('usuarios/', include('api.usuarios.urls')), 
    path('roles/', include('api.roles.urls')),
    path('dashboard/', include('api.dashboard.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
