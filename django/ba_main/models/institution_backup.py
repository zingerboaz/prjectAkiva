from django.db import models


class InstitutionBackup(models.Model):
    semel = models.IntegerField()
    institution_details = models.JSONField(null=True)
    education_picture = models.JSONField(null=True)
    year = models.IntegerField()

    def __str__(self):
        return self.semel