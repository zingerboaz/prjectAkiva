from django.db import models


class GroupName(models.Model):
    title = models.CharField(max_length=300)

    def __str__(self):
        return self.title