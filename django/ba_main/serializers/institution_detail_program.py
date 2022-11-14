from rest_framework import serializers

from ba_main.models.institutionprogram import InstitutionProgram


class InstitutionDetailsProgramSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = InstitutionProgram
        depth = 1