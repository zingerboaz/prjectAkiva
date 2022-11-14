from django.db import models

from ba_main.models import InstitutionDetails


class InstitutionProgram(models.Model):

    program_type = models.TextField(max_length=3000, null=True, blank=True, default='')
    name = models.TextField(max_length=3000, default='')
    purpose = models.TextField(max_length=3000, default='')
    target_audience = models.TextField(max_length=3000, default='')
    regularity = models.TextField(max_length=3000, default='')
    success_factors = models.TextField(max_length=3000, default='')
    institution_details = models.ForeignKey(InstitutionDetails, on_delete=models.CASCADE, related_name='programs')

    def __str__(self):
        return self.name