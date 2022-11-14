from rest_framework import serializers


class StoryAndStrengthSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField()
    year = serializers.CharField()
    strength = serializers.CharField(allow_blank=True, allow_null=True)
    story = serializers.CharField(allow_blank=True, allow_null=True)
    challenge = serializers.CharField(allow_blank=True, allow_null=True)