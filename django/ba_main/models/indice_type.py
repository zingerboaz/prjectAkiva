from enum import Enum
from django.db import models

YEARLY_INDICES_CHOICES = (
    ('EDUCATION','education'),
    ('SOCIAL', 'social'),
    ('STAFF', 'staff'),
    ('STAFF_2', 'staff2'),
    ('PARTICIPATION', 'participation'),
    ('NOT_CLEAR', 'not_clear')
)

class YearlyIndiceTypes(Enum):
    EDUCATION = 'EDUCATION'
    SOCIAL = 'SOCIAL'
    STAFF = 'STAFF'
    STAFF_2 = 'STAFF_2'
    PARTICIPATION = 'PARTICIPATION'



class IndiceType(models.Model):
    name = models.CharField(max_length=20, choices=YEARLY_INDICES_CHOICES, unique=True, default='not_clear')


    def __str__(self):
        return self.name