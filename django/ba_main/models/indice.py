from django.db import models

from ba_main.models.chativa import Chativa
from ba_main.models.indice_subject import IndiceSubject


class InstitutionIndice(models.Model):
    subject = models.ForeignKey(IndiceSubject, on_delete=models.CASCADE, null=True, related_name='indices')
    value = models.IntegerField()
    similar = models.IntegerField(null=True)
    average = models.IntegerField(null=True)
    special_education = models.BooleanField(default=False)
    chativa = models.ForeignKey(Chativa, on_delete=models.CASCADE, blank=True, null=True)

    def subject_name(self):
        return self.subject.name.title
    subject_name.short_description = 'Subject'

    def chativa_name(self):
        if not self.chativa:
            return ''
        return self.chativa.name
    chativa_name.short_description = 'Chativa'

    def group_name(self):
        return self.subject.indice_group.name
    group_name.short_description = 'Group'

    def __str__(self):
        return f'{self.id} -{self.subject.name} - {self.value}'

    class Meta:
        verbose_name = 'מדד השתתפות'
        verbose_name_plural = 'מדדי השתתפות'
