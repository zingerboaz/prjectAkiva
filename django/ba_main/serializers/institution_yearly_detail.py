from rest_framework import serializers

from ba_main.models import InstitutionDetails, Year
from ba_main.serializers.institution import InstitutionSerializer
from ba_main.serializers.institution_detail_program import InstitutionDetailsProgramSerializer


class InstitutionYearlyDetailSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer()
    programs = InstitutionDetailsProgramSerializer(many=True, read_only=True)

    class Meta:
        model = InstitutionDetails
        fields = '__all__'
        depth = 1

class InstitutionDetailsRequestSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField(required=True)
    year_name = serializers.CharField(required=True, max_length=4)

class EvaluationFieldsSerializer(serializers.Serializer):
    """
    Serializer for create/edit evaluation fields
    """
    institution_strength = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    institution_story = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    institution_challenge = serializers.CharField(allow_null=True, allow_blank=True, required=False)


class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = '__all__'
        # depth = 1
