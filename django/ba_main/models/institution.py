import os

from django.db import models
from ba_main.models.user import User
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

def upload_to(instance, filename):
    now = timezone.now()
    base, extension = os.path.splitext(filename.lower())
    milliseconds = now.microsecond // 1000
    return f"users/{instance.pk}/{now:%Y%m%d%H%M%S}{milliseconds}{extension}"


class Institution(models.Model):
    objects = models.Manager()

    name = models.CharField(max_length=255)
    semel = models.CharField(max_length=255, blank=True, null=True)
    logo_url = models.CharField(max_length=255, blank=True, null=True)
    background_url =  models.CharField(max_length=255, blank=True, null=True)
    manager = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='institution')
    area_manager = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='area_institutions')
    image = models.ImageField(_("Image"), upload_to=upload_to, blank=True)
    inspector = models.CharField(max_length=255, blank=True, null=True)
    is_boarding = models.BooleanField(default=False, blank=True, null=True)
    full_ownership = models.BooleanField(default=False, blank=True, null=True)

    def __str__(self):
        return f'#{self.id} - {self.name}'

    class Meta:
        verbose_name = _('מוסד')
        verbose_name_plural = _('מוסדות')
