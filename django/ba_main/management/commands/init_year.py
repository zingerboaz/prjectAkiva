from django.core.management import BaseCommand

from ba_main.models import Year

years = [['2015', 'תשע״ה'], ['2016', 'תשע״ו'], ['2017', 'תשע״ז'], ['2018', 'תשע״ח'], ['2019', 'תשע״ט'],
         ['2020', 'תש"פ'], ['2021', 'תשפ״א'],
         ['2022', 'תשפ״ב'], ['2023', 'תשפ״ג'], ['2024', 'תשפ״ד'], ['2025', 'תשפ״ה'], ['2026', 'תשפ״ו'],
         ['2027', 'תשפ״ז'], ['2028', 'תשפ״ח'],
         ['2029', 'תשפ״ט'], ['2030', 'תש״צ'], ['2031', 'תשצ״א'], ['2032', 'תשצ״ב'], ['2033', 'תשצ״ג'], ['2034', 'תשצ״ד'],
         ['2035', 'תשצ״ה'], ['2036', 'תשצ״ו'], ['2037', 'תשצ״ז']]


def init_years():
    for year in years:
        try:
            db_year = Year.objects.get(name=year[0])
            if not db_year.hebrew_name:
                db_year.hebrew_name = year[1]
                db_year.save()
        except Year.DoesNotExist:
            try:
                db_year = Year.objects.get(hebrew_name=year[1])
                db_year.name = year[0]
                db_year.save()
            except Year.DoesNotExist:
                db_year, is_created = Year.objects.get_or_create(
                    name=year[0], hebrew_name=year[1])
                db_year.save()

class Command(BaseCommand):
    def handle(self, *args, **options):
        init_years()
