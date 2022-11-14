from django.db import models

from ba_main.models import YearlyIndice
from ba_main.models.group_name import GroupName


class IndiceGroup(models.Model):
    # name = models.CharField(max_length=300)
    name = models.ForeignKey(GroupName, on_delete=models.CASCADE, null=True)
    yearly_indice = models.ForeignKey(YearlyIndice, on_delete=models.CASCADE, null=True, related_name='groups')

    def __str__(self):
        # return f'#{self.id} - {self.name.title} - {self.yearly_indice.institution.name}'
        return f'#{self.id} - {self.name.title}'