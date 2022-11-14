from __future__ import unicode_literals

from django.utils.translation import ugettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ba_main.models import InstitutionDetails
from ba_main.models.user import User
from ba_main.serializers.institution_yearly_detail import InstitutionYearlyDetailSerializer, EvaluationFieldsSerializer, \
    InstitutionDetailsRequestSerializer
from proj.utils import Utils


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_institutions_details(request):
    # current_user = User.objects.get(email=request.user)
    request_data_serializer = InstitutionDetailsRequestSerializer(data=request.data)

    if not request_data_serializer.is_valid():
        return Utils.create_invalid_data_error_response(request.data, request_data_serializer.errors)

    request_data = request_data_serializer.data
    return get_institution_details_form_database(request_data.get('institution_id'), request_data.get('year_name'))





def get_institution_details_form_database(institution_id: int, year_name: str):
    try:
        institution_last_year_details = InstitutionDetails.objects.filter(institution_id=institution_id, year__name=year_name)

        serializer = InstitutionYearlyDetailSerializer(institution_last_year_details, many=True)
        data = serializer.data
        return Response(data)

    except InstitutionDetails.DoesNotExist:
        return Response({_('Institution not found')},
                        status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_yearly_institution_details_list(request, institution_id):

    # request_data_serializer = InstitutionDetailsRequestSerializer(data=request.data)
    # if not request_data_serializer.is_valid():
    #     return Utils.create_invalid_data_error_response({'institution_id': institution_id}, request_data_serializer.errors)

    # request_data = request_data_serializer.data
    institution_last_year_details_list = InstitutionDetails.objects\
        .filter(institution_id=institution_id)\
        .order_by('year__name')
    serializer = InstitutionYearlyDetailSerializer(institution_last_year_details_list, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def patch_evaluation_fields(request, institution_id, year_id):
    serializer = EvaluationFieldsSerializer(data=request.data)
    if serializer.is_valid():
        current_user = User.objects.get(email=request.user)

        if current_user.institution_id:
            if institution_id == current_user.institution_id:
                institution = InstitutionDetails.objects.get(institution_id=institution_id, year_id=year_id)
                if serializer.data.get('institution_strength'):
                    institution.institution_strength = serializer.data.get('institution_strength')
                if serializer.data.get('institution_story'):
                    institution.institution_story = serializer.data.get('institution_story')
                institution.save()
                return Response(
                    {_('Institution successfully updated')},
                    status=status.HTTP_204_NO_CONTENT)
            else:
                return unauthorized_edit_error()

        else:
            return unauthorized_edit_error()
    else:
        return Response(
            {_('Bad request')},
            status=status.HTTP_400_BAD_REQUEST)


def unauthorized_edit_error():
    return Response({_('Only the institution director can edit this information')},
                    status=status.HTTP_401_UNAUTHORIZED)
