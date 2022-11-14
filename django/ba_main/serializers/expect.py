from rest_framework import serializers

from ba_main.models import Expect, Institution
from ba_main.serializers.institution import InstitutionSerializer


class ExpectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expect
        fields = '__all__'




class GetExpectRequestSerializer(serializers.Serializer):
    institution_id = serializers.CharField(max_length=4)
    expect: Expect

    def get_expect(self):
        try:
            expect: Expect = Expect.objects.get(
                institution_id=self.validated_data.get('institution_id'))

            return ExpectSerializer(expect).data
        except Expect.DoesNotExist:
           return None


class UpdateExpectRequestSerializer(serializers.Serializer):
    institution_id = serializers.CharField(max_length=4)
    expect = ExpectSerializer()

    def create(self, validated_data):
        expect_validated_data = validated_data.pop('expect')
        try:
            expect_obj= Expect.objects.get(
                    institution_id = validated_data.get('institution_id'))
            print("-- ", expect_obj)
            expect_obj.institution_id = validated_data.get('institution_id')
            expect_obj.current_eligible = expect_validated_data.get('current_eligible')
            expect_obj.current_outstanding = expect_validated_data.get('current_outstanding')
            expect_obj.current_math_4 = expect_validated_data.get('current_math_4')
            expect_obj.current_math_5 = expect_validated_data.get('current_math_5')
            expect_obj.current_eng_4 = expect_validated_data.get('current_eng_4')
            expect_obj.current_eng_5 = expect_validated_data.get('current_eng_5')
            expect_obj.last_eligible = expect_validated_data.get('last_eligible')
            expect_obj.last_outstanding = expect_validated_data.get('last_outstanding')
            expect_obj.last_math_4 = expect_validated_data.get('last_math_4')
            expect_obj.last_math_5 = expect_validated_data.get('last_math_5')
            expect_obj.last_eng_4 = expect_validated_data.get('last_eng_4')
            expect_obj.last_eng_5 = expect_validated_data.get('last_eng_5')
            expect_obj.save()
            return expect_obj
        except:
            print("-- test")
            expect, expect_created = Expect.objects.update_or_create(
                defaults=expect_validated_data,
                institution_id=validated_data.get('institution_id'))

            expect.save()
            return expect

    def update_filed(field, value):
        field = value
        field.save()