from rest_framework import serializers

from ba_main.models import InstitutionDetails
from ba_main.models.institution import Institution
from ba_main.serializers.user import ManagerSerializer


class SingleInstitutionSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(required=False)
    area_manager = ManagerSerializer(required=False)
    last_updated_year = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = '__all__'
        depth = 1

    def get_last_updated_year(self, institution: Institution):
        last_updated_details: InstitutionDetails = None
        try:
            last_updated_details = list(InstitutionDetails.objects.filter(institution__id=institution.id).order_by('-year__name'))[0]
            return last_updated_details.year.name
        except:
            return 2021



class InstitutionSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(required=False)
    area_manager = ManagerSerializer(required=False)

    class Meta:
        model = Institution
        fields = '__all__'
        depth = 1

    def save(self, *args, **kwargs):
        if self.instance.avatar:
            self.instance.avatar.delete()
        return super().save(*args, **kwargs)


class ImageSerializer(serializers.Serializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
