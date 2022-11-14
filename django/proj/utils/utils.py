from random import randint
from rest_framework.response import Response
from rest_framework import status


def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)


class Utils:


    @staticmethod
    def create_invalid_data_error_response(data, error) -> Response:
        return Response(
            {
                'data': data,
                'error': error
            },
            status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_instance_updated_response(instance_name, updated_instance_body) -> Response:
        return Response({
            'message': f'{instance_name} was updated successfully',
            'data': updated_instance_body
        },
        status=status.HTTP_201_CREATED
        )


    @staticmethod
    def create_instance_not_found_response(instance_name: str) -> Response:
        return Response(
            {
                'error': f'{instance_name} NOT FOUND!'
            },
            status=status.HTTP_404_NOT_FOUND
        )

