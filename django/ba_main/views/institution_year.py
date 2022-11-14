from rest_framework import viewsets

from ba_main.models import Year


class InstitutionYearViewSet(viewsets.ModelViewSet):
    queryset = Year.objects.all()
