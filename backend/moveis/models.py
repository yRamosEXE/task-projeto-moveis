#from django.db import models

# Create your models here.

from django.db import models

class Movel(models.Model):
    # O campo 'id' (Primary Key) é criado automaticamente pelo Django, não precisamos de o escrever!
    
    nome = models.CharField(max_length=255)
    marca = models.CharField(max_length=100)
    quantidade = models.IntegerField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)

    # Esta função diz ao Django como exibir o nome deste objeto no painel de administração
    def __str__(self):
        return f"{self.nome} ({self.marca})"