from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovelViewSet

# O Router é o carteiro automático do Django REST Framework
router = DefaultRouter()
router.register(r'moveis', MovelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]