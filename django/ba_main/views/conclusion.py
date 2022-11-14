from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from ba_main.serializers.conclusion import UpdateConclusionRequestSerializer, ConclusionSerializer, \
    GetConclusionRequestSerializer
from proj.utils import Utils


@api_view(['PUT'])
def create_or_update_conclusion(request: Request):
    conclusion_request_serializer = UpdateConclusionRequestSerializer(data=request.data)
    if not conclusion_request_serializer.is_valid():
        return Utils.create_invalid_data_error_response(request.data, conclusion_request_serializer.errors)
    conclusion = conclusion_request_serializer.save()
    conclusion_serializer = ConclusionSerializer(conclusion)
    return Utils.create_instance_updated_response('Conclusion', conclusion_serializer.data)


@api_view(['POST'])
def get_conclusion(request: Request):
    get_conclusion_serializer = GetConclusionRequestSerializer(data=request.data)
    if not get_conclusion_serializer.is_valid():
        return Utils.create_invalid_data_error_response(request.data, get_conclusion_serializer.errors)
    return Response(get_conclusion_serializer.get_conclusion())