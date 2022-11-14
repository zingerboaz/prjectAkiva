from django.db import models


class SubjectName(models.Model):
    title = models.CharField(max_length=300)


    def __str__(self):
        return f'#{self.id} - {self.title}'