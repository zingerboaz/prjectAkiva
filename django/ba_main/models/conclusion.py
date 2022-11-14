from django.db import models


class Conclusion(models.Model):
    content = models.TextField(blank=True)

    def __str__(self):
        return 'Conclusion # {}'.format(self.id)