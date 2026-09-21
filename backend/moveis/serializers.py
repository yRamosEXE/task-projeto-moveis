from rest_framework import serializers
from .models import Movel

class MovelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movel
        # O '__all__' diz ao Django para incluir todos os campos automaticamente (id, nome, marca, etc.)
        fields = '__all__'