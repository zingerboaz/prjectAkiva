from django.db import models
from ba_main.models.year_goal import YearlyGoal

class ActionWay(models.Model):
    direction = models.TextField(blank=True, null=True)
    success_indice = models.CharField(max_length=255, blank=True, null=True)
    goal = models.ForeignKey(YearlyGoal, on_delete=models.CASCADE, related_name='action_ways', null=True)
