from django.db import models
from ba_main.models.action_way import ActionWay


class Milestone(models.Model):
    description = models.TextField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    action_way = models.ForeignKey(ActionWay, on_delete=models.CASCADE, related_name='milestones')

    @property
    def formatted_date(self):
        return self.date.strftime('%d/%m/%Y')