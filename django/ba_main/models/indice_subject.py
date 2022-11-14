from django.db import models

from ba_main.models.indice_group import IndiceGroup
from ba_main.models.subject_name import SubjectName


class IndiceSubject(models.Model):
    # name = models.CharField(max_length=300)
    name = models.ForeignKey(SubjectName, on_delete=models.CASCADE, null=True, related_name='indices')
    indice_group = models.ForeignKey(IndiceGroup, on_delete=models.CASCADE, null=True, related_name='subjects')

    def __str__(self):
        if self.name:
            return self.name.title
        else:
            return self.id