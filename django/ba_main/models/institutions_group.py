from django.db import models
from django.utils.translation import ugettext_lazy as _


class InstitutionsGroup(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)

    # class Meta:
    #     verbose_name = _('Group')
    #     verbose_name_plural = _('Groups')
