from rest_framework import serializers

from ba_main.models.participation_details import ParticipationDetails
from ba_main.models.participation_subject import ParticipationSubject


class ParticipationRequestSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField(required=True)
    year = serializers.CharField(required=True, max_length=4)


class ParticipationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipationSubject
        exclude = ['id', 'details']

class ParticipationDetailsSerializer(serializers.ModelSerializer):
    subjects = ParticipationSerializer(many=True)
    context = serializers.CharField(source='context.name')
    year = serializers.CharField(source='year.name')

    class Meta:
        model = ParticipationDetails
        exclude = ['id']
        # depth = 1