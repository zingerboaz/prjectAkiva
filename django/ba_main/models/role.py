from django.db import models
from django.utils.translation import ugettext_lazy as _


class Role(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    # class Meta:
    #     verbose_name = _('Role')
    #     verbose_name_plural = _('Roles')


