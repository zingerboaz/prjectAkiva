from django.db import models

CHATIVA_CHOICES = (
    ('high', 'חט"ע'),
    ('middle', 'חט"ב')
)

class Chativa(models.Model):
    name = models.CharField(max_length=8, unique=True, choices=CHATIVA_CHOICES)


    def __str__(self):
        return self.name