from rest_framework import serializers


class ProgramSerializer(serializers.Serializer):
    name_of_program = serializers.CharField()
    goal_of_program = serializers.CharField()
    target_audience = serializers.CharField()
    regularity = serializers.CharField()
    success_factors = serializers.CharField()
    # institution_id = serializers.IntegerField()
