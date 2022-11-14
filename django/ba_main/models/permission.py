from django.db import models
from django.utils.translation import ugettext_lazy as _


class Permission(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    # class Meta:
    #     verbose_name = _('Permission')
    #     verbose_name_plural = _('Permissions')
