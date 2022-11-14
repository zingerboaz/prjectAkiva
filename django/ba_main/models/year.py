from django.db import models

class Year(models.Model):
    name = models.CharField(max_length=4, unique=True)
    hebrew_name = models.CharField(max_length=255)

    def __str__(self):
        return self.name + ' - ' + self.hebrew_name

    def __eq__(self, other):
        if not isinstance(other, Year):
            # don't attempt to compare against unrelated types
            return NotImplemented
        return self.id == other.id

    @staticmethod
    def get_current_year():
        import datetime
        year = datetime.datetime.now().year
        year, is_created = Year.objects.get_or_create(name=str(year),defaults={'name': str(year)})
        return year


    # class Meta:
    #     verbose_name = _('Year')
    #     verbose_name_plural = _('Years')
