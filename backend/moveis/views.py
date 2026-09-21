from rest_framework import viewsets
from .models import Movel
from .serializers import MovelSerializer

class MovelViewSet(viewsets.ModelViewSet):
    queryset = Movel.objects.all()
    serializer_class = MovelSerializer