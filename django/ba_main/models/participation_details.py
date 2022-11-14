from django.db import models

from ba_main.models import Year
from ba_main.models.institution import Institution
from ba_main.models.participation_context import ParticipationContext


class ParticipationDetails(models.Model):
    year = models.ForeignKey(Year, on_delete=models.CASCADE)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    context = models.ForeignKey(ParticipationContext, on_delete=models.CASCADE)

    def __str__(self):
        return '{0} - {1} - {2}'.format(self.context.name, self.year.name, self.institution.name)