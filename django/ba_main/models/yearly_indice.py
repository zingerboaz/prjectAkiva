from django.db import models

from ba_main.models import Year
from ba_main.models.chativa import Chativa
from ba_main.models.conclusion import Conclusion
from ba_main.models.indice_type import IndiceType
from ba_main.models.institution import Institution


class YearlyIndice(models.Model):
    type = models.ForeignKey(IndiceType, on_delete=models.CASCADE)
    conclusion = models.OneToOneField(
        Conclusion,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='yearly_indice')
    year = models.ForeignKey(Year, on_delete=models.CASCADE)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)

    def __str__(self):
        return f'{ self.type.name } {self.institution.name} {self.year.__str__()}'

