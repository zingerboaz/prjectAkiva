from django.db import models
from django.utils.translation import ugettext_lazy as _

from ba_main.models import Permission, Role


class PermissionRole(models.Model):
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, null=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

    # class Meta:
    #     verbose_name = _('Permission Role')
    #     verbose_name_plural = _('Permission Roles')
