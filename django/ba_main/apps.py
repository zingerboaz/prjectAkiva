from django.apps import AppConfig
from django.db.models.signals import pre_save
from django.utils.translation import ugettext_lazy as _



class BaMainConfig(AppConfig):
    name = 'ba_main'
    verbose_name = 'מסד נתונים של אתר בני עקיבא'


    def ready(self):
        from .signals import handle_pass_and_send_auth_details
        from .models.user import User
        pre_save.connect(handle_pass_and_send_auth_details, sender=User)
