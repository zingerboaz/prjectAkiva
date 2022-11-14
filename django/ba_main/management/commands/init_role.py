from django.core.management import BaseCommand

from ba_main.models import Role


def init_roles():
    institution_manager, is_created = Role.objects.get_or_create(
        name='מנהל מוסד', defaults={'name': 'מנהל מוסד'})
    institution_manager.save()
    region_manager, is_created = Role.objects.get_or_create(
        name='מנהל מרחב', defaults={'name': 'מנהל מרחב'})
    region_manager.save()
    developer, is_created = Role.objects.get_or_create(
        name='מפתח', defaults={'name': 'מפתח'})
    developer.save()


class Command(BaseCommand):
    def handle(self, *args, **options):
        init_roles()