from django.contrib.auth.models import AbstractUser
from django.db import models

from .role import Role


class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    is_change_password_required = models.BooleanField(default=True)
    mobile = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    image_profile = models.CharField(max_length=255, blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']

    def is_manager(self):
        return self.role.name == 'מנהל מוסד'

    def make_manager(self):
        self.role, is_created = Role.objects.get_or_create(
            name='מנהל מוסד', defaults={ 'name': 'מנהל מוסד'})

    def is_area_manager(self):
        return self.role.name == 'מנהל מרחב'

    def make_area_manager(self):
        self.role, is_created = Role.objects.get_or_create(
            name='מנהל מרחב', defaults={'name': 'מנהל מרחב'})

    def is_developer(self):
        return self.role.name == 'מפתח'


    def __str__(self):
        return f'{self.first_name} {self.last_name}'

