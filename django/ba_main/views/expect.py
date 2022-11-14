from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from ba_main.serializers.expect import UpdateExpectRequestSerializer, ExpectSerializer, \
    GetExpectRequestSerializer
from proj.utils import Utils


@api_view(['PUT'])
def create_or_update_expect(request: Request):
    print("data", request.data)
    expect_request_serializer = UpdateExpectRequestSerializer(data=request.data)
    if not expect_request_serializer.is_valid():
        return Utils.create_invalid_data_error_response(request.data, expect_request_serializer.errors)
    expect = expect_request_serializer.save()
    expect_serializer = ExpectSerializer(expect)
    return Utils.create_instance_updated_response('expect', expect_serializer.data)


@api_view(['POST'])
def get_expect(request: Request):
    print("data", request.data)
    get_expect_serializer = GetExpectRequestSerializer(data=request.data)
    if not get_expect_serializer.is_valid():
        return Utils.create_invalid_data_error_response(request.data, get_expect_serializer.errors)
    return Response(get_expect_serializer.get_expect())