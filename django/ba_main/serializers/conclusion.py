from rest_framework import serializers

from ba_main.models import Conclusion, YearlyIndice
from ba_main.serializers.yearly_indice import YearlyIndiceSerializer


class ConclusionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Conclusion
        fields = '__all__'




class GetConclusionRequestSerializer(serializers.Serializer):
    year_name = serializers.CharField(max_length=4)
    indice_type = serializers.CharField()
    institution_id = serializers.IntegerField()
    yearly_indice: YearlyIndice

    def get_conclusion(self):
        try:
            yearly_indice: YearlyIndice = YearlyIndice.objects.get(
                institution__id=self.validated_data.get('institution_id'),
                year__name=self.validated_data.get('year_name'),
                type__name=self.validated_data.get('indice_type')
            )

            return YearlyIndiceSerializer(yearly_indice).data
        except YearlyIndice.DoesNotExist:
            return None


class UpdateConclusionRequestSerializer(serializers.Serializer):
   year_name= serializers.CharField(max_length=4)
   indice_type = serializers.CharField()
   institution_id = serializers.IntegerField()
   conclusion = ConclusionSerializer()

   def create(self, validated_data):
       print('validated_data', validated_data)
       yearly_indice: YearlyIndice = YearlyIndice.objects.get(
           institution__id=validated_data.get('institution_id'),
           year__name=validated_data.get('year_name'),
           type__name=validated_data.get('indice_type'))
       conclusion_validated_data = validated_data.pop('conclusion')
       if yearly_indice.conclusion:
           yearly_indice.conclusion.content = conclusion_validated_data.get('content')
           yearly_indice.save()
           yearly_indice.conclusion.save()
           return yearly_indice.conclusion
       else:
           conclusion, conclusion_created = Conclusion.objects.update_or_create(
               defaults=conclusion_validated_data,
               id=conclusion_validated_data.get('id'))
           conclusion.yearly_indice = yearly_indice
           conclusion.save()
           yearly_indice.save()
           return conclusion







