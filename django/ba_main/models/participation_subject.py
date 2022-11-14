from django.db import models

from ba_main.models.participation_details import ParticipationDetails


class ParticipationSubject(models.Model):
    subject = models.CharField(max_length=150)
    happened = models.BooleanField(default=False)
    details = models.ForeignKey(ParticipationDetails, on_delete=models.CASCADE, related_name='subjects')

    def __str__(self):
        return '{} - {} - {}'.format(self.subject, self.details.year, self.details.institution.name)