from django.db import models

from ba_main.models import Year
from ba_main.models.institution import Institution

YEARLY_GOAL_SCOPE_CHOICES = (
    ('MISSION', 'mission'),
    ('IDENTITY','identity'),
    ('EXCELLENCE','excellence')
)


class YearlyGoal(models.Model):
    scope = models.TextField(choices=YEARLY_GOAL_SCOPE_CHOICES, null=True)
    description = models.TextField()
    reason = models.TextField()
    description2 = models.TextField(null=True)
    reason2 = models.TextField(null=True)
    year = models.ForeignKey(Year, on_delete=models.CASCADE)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, null=True, related_name='yearly_goals')
    edit_expiration = models.DateField(blank=True, null=True)

