from django.db import models


class Expect(models.Model):
    institution_id = models.CharField(max_length=4, blank=True,primary_key=True)
    current_eligible = models.IntegerField(blank=True, null=True)
    current_outstanding = models.IntegerField(blank=True, null=True)
    current_math_4 = models.IntegerField(blank=True, null=True)
    current_math_5 = models.IntegerField(blank=True, null=True)
    current_eng_4 = models.IntegerField(blank=True, null=True)
    current_eng_5 = models.IntegerField(blank=True, null=True)
    last_eligible = models.IntegerField(blank=True, null=True)
    last_outstanding = models.IntegerField(blank=True, null=True)
    last_math_4 = models.IntegerField(blank=True, null=True)
    last_math_5 = models.IntegerField(blank=True, null=True)
    last_eng_4 = models.IntegerField(blank=True, null=True)
    last_eng_5 = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return 'Expect # {}'.format(self.institution_id)