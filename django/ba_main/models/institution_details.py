from django.db import models
from django.utils.translation import ugettext_lazy as _

from ba_main.models.year import Year
from ba_main.models.institution import Institution


class InstitutionDetails(models.Model):
    objects = models.Manager()

    num_of_student = models.IntegerField()
    num_of_class = models.IntegerField()
    num_of_special_class = models.IntegerField(null=True)
    num_of_teacher = models.IntegerField()
    student_integration = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    institution_strength = models.TextField(max_length=3000, blank=True, null=True)
    institution_story = models.TextField(max_length=3000, blank=True, null=True)
    institution_challenge = models.TextField(max_length=3000, blank=True, null=True)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, null=True, related_name='details')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return '{name} - {year}'.format(name=self.institution.name, year=self.year.name)

    class Meta:
        verbose_name = _('Institution Detail')
        verbose_name_plural = _('Institution Details')
