from __future__ import unicode_literals
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ba_main.models import Year

from ba_main.serializers.institution_yearly_detail import YearSerializer


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_year_list_by_institution(request, institution_id):
#
#     institution_yearly_details = InstitutionYearlyDetail.objects.filter(institution=institution_id)
#     serializer = YearSerializer(institution_yearly_details, many=True)
#     return Response(serializer.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_years(request):
    years_list = Year.objects.all()
    serializer = YearSerializer(years_list, many=True)
    return Response(serializer.data)