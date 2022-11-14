from __future__ import unicode_literals
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from ba_main.models.user import User
from django.utils.translation import ugettext_lazy as _

from ba_main.models.participation_details import ParticipationDetails
from ba_main.serializers.participation import ParticipationRequestSerializer, ParticipationDetailsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_participation_indices(request, institution_id, year_id):
    current_user = User.objects.get(email=request.user)

    if current_user.institution_id:
        if institution_id == current_user.institution_id:
            return get_participation_indices_form_database(institution_id, year_id)
        else:
            return Response({_('Only the institution director can access to this information')},
                            status=status.HTTP_401_UNAUTHORIZED)
    else:
        return get_participation_indices_form_database(institution_id, year_id)


def get_participation_indices_form_database(institution_id, year_id):
    # try:
    #     indices = ParticipationIndice.objects.filter(institution_id=institution_id, year_id=year_id)
    #     serializer = ParticipationIndiceSerializer(indices, many=True)
    #     return Response(serializer.data)
    # except ParticipationIndice.DoesNotExist:
    #     return Response({_('Institution not found')},
    #                     status=status.HTTP_404_NOT_FOUND)
    pass

def fetch_participation_request_data(request: Request):
    participation_request_serializer = ParticipationRequestSerializer(data=request.data)
    if participation_request_serializer.is_valid():
        request_data = participation_request_serializer.data
        return request_data
    else:
        return None


@api_view(['POST'])
def get_institute_participation(request):
    request_data = fetch_participation_request_data(request)
    participation_results = ParticipationDetails.objects.filter(
        year__name=request_data.get('year'),
        institution_id=request_data.get('institution_id')
    )
    participation_response = ParticipationDetailsSerializer(participation_results, many=True)
    return Response(participation_response.data)
