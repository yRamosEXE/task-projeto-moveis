from django.contrib import admin
from django.urls import path, include  # Adicionámos o 'include' aqui

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('moveis.urls')),  # Ligamos as nossas rotas com o prefixo 'api/'
]