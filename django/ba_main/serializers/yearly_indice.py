from rest_framework import serializers
from typing import Optional

from ba_main.models import YearlyIndice, Year
from ba_main.models.indice import InstitutionIndice
from ba_main.models.indice_group import IndiceGroup
from ba_main.models.indice_subject import IndiceSubject


class YearModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = '__all__'


class InstitutionIndiceSerializer(serializers.ModelSerializer):
    # yearly_indice = serializers.StringRelatedField()
    yearly_indice = serializers.CharField(source='yearly_indice.type.name')

    class Meta:
        model = InstitutionIndice
        # fields = '__all__'
        exclude = ['id']
        depth = 0


class YearlyIndiceSerializer(serializers.ModelSerializer):
    conclusion = serializers.SerializerMethodField('get_conclusion')
    type = serializers.CharField(source='type.name')
    year = serializers.CharField(source='year.name')

    class Meta:
        model = YearlyIndice
        fields = '__all__'

    def get_conclusion(self, instance: YearlyIndice):
        if instance.conclusion:
            return self.instance.conclusion.content
        else:
            return ''


class BrieflyIndiceSerializer(serializers.ModelSerializer):
    yearly_indice = serializers.CharField(source='subject.indice_group.yearly_indice.type.name')
    year = serializers.CharField(source='subject.indice_group.yearly_indice.year.name')

    class Meta:
        model = InstitutionIndice
        fields = '__all__'


def get_selected_institutions_average(
        indice_subject: IndiceSubject,
        selected_institutions_ids: list) -> Optional[float]:
    if not selected_institutions_ids or not len(selected_institutions_ids):
        return None
    try:
        selected_institutions_subject_values = InstitutionIndice.objects \
            .filter(subject__name__id=indice_subject.name.id,
                    subject__indice_group__name__id=indice_subject.indice_group.name.id,
                    subject__indice_group__yearly_indice__institution__id__in=selected_institutions_ids)
        selected_institutions_index_values = []
        for index in selected_institutions_subject_values:
            selected_institutions_index_values.append(index.value)
        if not len(selected_institutions_index_values):
            return None
        return sum(selected_institutions_index_values) / len(selected_institutions_index_values)
    except InstitutionIndice.DoesNotExist:
        return None


def get_selected_institutions_average_by_year(
        indice_subject: IndiceSubject,
        selected_institutions_ids: list, year_name: str, chativa: str) -> Optional[float]:
    if not selected_institutions_ids or not len(selected_institutions_ids):
        return None
    try:
        selected_institutions_subject_values = InstitutionIndice.objects \
            .filter(subject__name__id=indice_subject.name.id,
                    subject__indice_group__name__id=indice_subject.indice_group.name.id,
                    subject__indice_group__yearly_indice__year__name=year_name,
                    subject__indice_group__yearly_indice__institution__id__in=selected_institutions_ids,
                    chativa__name=chativa)
        selected_institutions_index_values = []
        for index in selected_institutions_subject_values:
            selected_institutions_index_values.append(index.value)
        if not len(selected_institutions_index_values):
            return None
        return round(sum(selected_institutions_index_values) / len(selected_institutions_index_values))
    except InstitutionIndice.DoesNotExist:
        return None


def get_average_indice(indice_subject: IndiceSubject) -> Optional[float]:
    try:
        all_subject_indices = InstitutionIndice.objects.filter(
            subject__name__id=indice_subject.name.id,
            subject__indice_group__name__id=indice_subject.indice_group.name.id
        )
        index_values = []
        for index in all_subject_indices:
            index_values.append(index.value)
        return sum(index_values) / len(index_values)
    except InstitutionIndice.DoesNotExist:
        return None


def get_average_for_year(indice_subject: IndiceSubject, year_name: str) -> Optional[float]:
    try:
        all_subject_indices = InstitutionIndice.objects.filter(
            subject__name__id=indice_subject.name.id,
            subject__indice_group__name__id=indice_subject.indice_group.name.id,
            subject__indice_group__yearly_indice__year__name=year_name
        )
        index_values = []
        for index in all_subject_indices:
            index_values.append(index.value)
        return round(sum(index_values) / len(index_values))
    except InstitutionIndice.DoesNotExist:
        return None


class SubjectSerializer(serializers.ModelSerializer):
    # indices = InstitutionIndiceSerializer(many=True)
    name = serializers.CharField(source='name.title')
    values = serializers.SerializerMethodField()

    class Meta:
        model = IndiceSubject
        fields = '__all__'

    def get_values_by_years(self, indice_subject: IndiceSubject):
        indices_by_years = IndiceSubject.objects.filter(
            name__id=indice_subject.name.id,
            indice_group__name__id=indice_subject.indice_group.name.id,
            indice_group__yearly_indice__institution__id=indice_subject.indice_group.yearly_indice.institution.id
        ) \
            .order_by('indice_group__yearly_indice__year__name')
        values_by_years = {}
        average_by_years = {}

        for subject in indices_by_years.all():
            print(subject.indices)
            try:
                values_by_years[subject.indice_group.yearly_indice.year.hebrew_name] = subject.indices.value
            except:
                pass
        return values_by_years

    def get_average_by_years(self, indice_subject: IndiceSubject):
        values_by_years = []
        average_by_years = []
        selected_by_years = []
        selected_institutions_ids = self.context.get('selected_institutions', None)

        indices_by_years = IndiceSubject.objects.filter(
            name__id=indice_subject.name.id,
            indice_group__name__id=indice_subject.indice_group.name.id,
            indice_group__yearly_indice__institution__id=indice_subject.indice_group.yearly_indice.institution.id
        ) \
            .order_by('-indice_group__yearly_indice__year__name')

        for subject in indices_by_years.all():
            indice_all = InstitutionIndice()
            indice_high = InstitutionIndice()
            indice_middle = InstitutionIndice()
            indice_special = InstitutionIndice()
            try:
                indice_all: InstitutionIndice = InstitutionIndice.objects.get(subject=subject,
                                                                              chativa__name="all")
            except:
                pass
            try:
                indice_high: InstitutionIndice = InstitutionIndice.objects.get(subject=subject,
                                                                               chativa__name="high")
            except:
                pass
            try:
                indice_middle: InstitutionIndice = InstitutionIndice.objects.get(subject=subject,
                                                                                 chativa__name="middle")
            except:
                pass
            try:
                indice_special: InstitutionIndice = InstitutionIndice.objects.get(subject=subject,
                                                                                  chativa__name="special")
            except:
                pass
            # if not indice_all.value:
            #     if indice_middle.value and indice_high.value:
            #         indice_all.value = (indice_high.value + indice_middle.value) / 2
            #     elif indice_middle.value:
            #         indice_all.value = indice_middle.value
            #     elif indice_high.value:
            #         indice_all.value = indice_high.value
            year = subject.indice_group.yearly_indice.year.hebrew_name
            values_by_years.append({year: {"all": indice_all.value, "high": indice_high.value,
                                           "middle": indice_middle.value, "special": indice_special.value}})
            average_by_years.append({year: {"all": indice_all.average, "high": indice_high.average,
                                            "middle": indice_middle.average, "special": indice_special.average}})

            if type(selected_institutions_ids) is list and len(selected_institutions_ids):
                similar_by_year_all = get_selected_institutions_average_by_year(
                    indice_subject,
                    selected_institutions_ids, subject.indice_group.yearly_indice.year.name, "all")
                similar_by_year_special = get_selected_institutions_average_by_year(
                    indice_subject,
                    selected_institutions_ids, subject.indice_group.yearly_indice.year.name, "special")
                similar_by_year = {"all": similar_by_year_all, "special": similar_by_year_special}
            else:
                similar_by_year = {"all": indice_all.similar, "high": indice_high.similar,
                                   "middle": indice_middle.similar, "special": indice_special.similar}
            selected_by_years.append({year: similar_by_year})

        return {
            'own': values_by_years,
            'average': average_by_years,
            'selected': selected_by_years
        }

    def get_values(self, indice_subject: IndiceSubject):
        if indice_subject.name.title == 'ONLY_VALUE':
            return self.get_average_by_years(indice_subject)

        indice = None

        try:
            indice: InstitutionIndice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="all")
        except:
            try:
                indice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="high")
            except:
                try:
                    indice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="special")
                except:
                    try:
                        indice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="middle")
                    except:
                        try:
                            indice = InstitutionIndice.objects.get(subject=indice_subject)
                        except:
                            pass
        if indice:
            print(indice)
            own_value = round(indice.value)
            average = None
            if indice.average:
                average = round(indice.average)

            if self.context.get('own_only'):
                return {
                    'own': own_value,
                    'by_years': self.get_values_by_years(indice_subject)
                }

            selected_institutions_ids = self.context.get('selected_institutions', None)
            selected_institutions_average = indice.similar
            if selected_institutions_ids and type(selected_institutions_ids) is list:
                selected_institutions_average = get_selected_institutions_average(indice_subject, selected_institutions_ids)

            if not selected_institutions_average:
                selected_institutions_average = 0

            return {
                'own': own_value,
                'average': average,
                'selected': round(selected_institutions_average)
            }
        else:
            return {
                'own': None,
                'average': None,
                'selected': None
            }


class ValuesBySections:
    def __init__(self):
        self.high = []
        self.middle = []
        self.all = []
        self.special = []

    def get_high_section_avg(self) -> float:
        if not len(self.high) and not len(self.middle) and len(self.all):
            return round(sum(self.all) / len(self.all))
        elif len(self.high):
            return round(sum(self.high) / len(self.high))
        else:
            return None

    def get_middle_section_avg(self) -> float:
        if not len(self.middle):
            return None
        return round(sum(self.middle) / len(self.middle))

    def get_special_section_avg(self) -> float:
        if not len(self.special):
            return None
        return round(sum(self.special) / len(self.special))

    def get_avg(self):
        if len(self.all):
            return round(sum(self.all) / len(self.all))
        if (not len(self.high)) and (not len(self.middle)):
            return None
        if (len(self.high)) and (not len(self.middle)):
            return round(sum(self.high) / len(self.high))
        if (not len(self.high)) and (len(self.middle)):
            return round(sum(self.middle) / len(self.middle))
        return round((sum(self.high) + sum(self.middle)) / (len(self.high) + len(self.middle)))


def consider_values_by_sections_for_indices_group(values_by_sections: ValuesBySections, indice_group: IndiceGroup):
    all_group_subjects = indice_group.subjects.all()
    for indice_subject in all_group_subjects:
        try:
            indice: InstitutionIndice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="all")
            values_by_sections.all.append(indice.value)
        except:
            pass
        try:
            indice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="high")
            values_by_sections.high.append(indice.value)
        except:
            pass
        try:
            indice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="special")
            values_by_sections.special.append(indice.value)
        except:
            pass
        try:
            indice = InstitutionIndice.objects.get(subject=indice_subject, chativa__name="middle")
            values_by_sections.middle.append(indice.value)
        except:
            pass
    return values_by_sections


class IndiceGroupSerializer(serializers.ModelSerializer):
    yearly_indice = serializers.CharField(source='yearly_indice.type.name')
    name = serializers.CharField(source='name.title')
    subjects = SubjectSerializer(many=True)
    sections = serializers.SerializerMethodField('get_sections')
    value = serializers.SerializerMethodField()

    class Meta:
        model = IndiceGroup
        exclude = ['id']
        depth = 1

    def get_value(self, instance: IndiceGroup):
        list_of_subjects = list(instance.subjects.all())
        if len(list_of_subjects) == 1 and list_of_subjects[0].name.title == 'ONLY_VALUE':
            first_subject = list_of_subjects[0]
            special_value = None
            special_avg = None
            indice = InstitutionIndice()
            try:
                indice: InstitutionIndice = InstitutionIndice.objects.get(subject=first_subject,
                                                                          chativa__name="all")
                try:
                    indice_special = InstitutionIndice.objects.get(subject=first_subject, chativa__name="special")
                    special_value = indice_special.value
                    special_avg = indice_special.average
                except:
                    pass
            except:
                try:
                    indice = InstitutionIndice.objects.get(subject=first_subject, chativa__name="high")
                except:
                    try:
                        indice = InstitutionIndice.objects.get(subject=first_subject, chativa__name="middle")
                    except:
                        pass
            return {
                'own': indice.value,
                'average': indice.average,
                'special_own': special_value,
                'special_average': special_avg
            }

        own_values_by_sections = ValuesBySections()
        own_values_by_sections = consider_values_by_sections_for_indices_group(own_values_by_sections, instance)

        avg_values_by_sections = ValuesBySections()
        indice_groups = IndiceGroup.objects.filter(
            yearly_indice__year__id=instance.yearly_indice.year.id,
            name__id=instance.name.id
        )
        for group in list(indice_groups):
            avg_values_by_sections = consider_values_by_sections_for_indices_group(avg_values_by_sections, group)

        return {
            'own': own_values_by_sections.get_avg(),
            'average': avg_values_by_sections.get_avg()
        }

    def get_sections(self, instance: IndiceGroup):

        # if instance.name.title.__contains__('זכאים להסמכה טכנולוגית'):
        #     print('## Subjects of זכאים להסמכה טכנולוגית')
        #     for subject in instance.subjects.all():
        #         print('Own', subject.indices.value, 'Chativa', subject.indices.chativa)
        #         print('Avg', subject.indices.average, 'Chativa', subject.indices.chativa)
        #         print('Similar', subject.indices.similar, 'Chativa', subject.indices.chativa)

        list_of_subjects = list(instance.subjects.all())
        if len(list_of_subjects) == 1 and list_of_subjects[0].name.title == 'ONLY_VALUE':
            first_subject = list_of_subjects[0]
            indice_all = InstitutionIndice()
            indice_high = InstitutionIndice()
            indice_middle = InstitutionIndice()
            indice_special = InstitutionIndice()
            try:
                indice_all: InstitutionIndice = InstitutionIndice.objects.get(subject=first_subject,
                                                                              chativa__name="all")
            except:
                pass
            try:
                indice_high: InstitutionIndice = InstitutionIndice.objects.get(subject=first_subject,
                                                                               chativa__name="high")
            except:
                pass
            try:
                indice_middle: InstitutionIndice = InstitutionIndice.objects.get(subject=first_subject,
                                                                                 chativa__name="middle")
            except:
                pass
            try:
                indice_special: InstitutionIndice = InstitutionIndice.objects.get(subject=first_subject,
                                                                                  chativa__name="special")
            except:
                pass

            if (not indice_high.average and not indice_middle.average and indice_all.average)\
                    or (not indice_high.value and not indice_middle.value and indice_all.value):
                indice_high = indice_all

            selected_institutions_ids: list = self.context.get('selected_institutions')
            selected_values_by_sections = ValuesBySections()
            if instance.name.title == '':
                print()
            if type(selected_institutions_ids) == list and len(selected_institutions_ids):
                selected_institutions_ids = self.context.get('selected_institutions')
                selected_institutions_indice_groups = IndiceGroup.objects.filter(
                    yearly_indice__year__id=instance.yearly_indice.year.id,
                    name__id=instance.name.id,
                    yearly_indice__institution__id__in=selected_institutions_ids
                )
                for group in list(selected_institutions_indice_groups):
                    first_group_subject = list(group.subjects.all())[0]
                    try:
                        indice: InstitutionIndice = InstitutionIndice.objects.get(subject=first_group_subject,
                                                                                  chativa__name="all")
                        selected_values_by_sections.all.append(indice.value)
                    except:
                        pass
                    try:
                        indice = InstitutionIndice.objects.get(subject=first_group_subject, chativa__name="high")
                        selected_values_by_sections.high.append(indice.value)
                    except:
                        pass
                    try:
                        indice = InstitutionIndice.objects.get(subject=first_group_subject, chativa__name="special")
                        selected_values_by_sections.special.append(indice.value)
                    except:
                        pass
                    try:
                        indice = InstitutionIndice.objects.get(subject=first_group_subject, chativa__name="middle")
                        selected_values_by_sections.middle.append(indice.value)
                    except:
                        pass
                all = 0
                high = 0
                middle = 0
                special = 0
                if len(selected_values_by_sections.all):
                    all = round(sum(selected_values_by_sections.all) / len(selected_values_by_sections.all))
                if len(selected_values_by_sections.high):
                    high = round(sum(selected_values_by_sections.high) / len(selected_values_by_sections.high))
                if len(selected_values_by_sections.middle):
                    middle = round(sum(selected_values_by_sections.middle) / len(selected_values_by_sections.middle))
                if len(selected_values_by_sections.special):
                    special = round(sum(selected_values_by_sections.special) / len(selected_values_by_sections.special))
                if len(selected_values_by_sections.all) and not len(selected_values_by_sections.high) and not len(selected_values_by_sections.middle):
                    high = round(sum(selected_values_by_sections.all) / len(selected_values_by_sections.all))


                return {
                    'own': {
                        'all': indice_all.value,
                        'high': indice_high.value,
                        'middle': indice_middle.value,
                        'special': indice_special.value
                    },
                    'average': {
                        'all': indice_all.average,
                        'high': indice_high.average,
                        'middle': indice_middle.average,
                        'special': indice_special.average
                    },
                    'selected': {
                        'all': all,
                        'high': high,
                        'middle': middle,
                        'special': special
                    }
                }
            else:
                return {
                    'own': {
                        'all': indice_all.value,
                        'high': indice_high.value,
                        'middle': indice_middle.value,
                        'special': indice_special.value
                    },
                    'average': {
                        'all': indice_all.average,
                        'high': indice_high.average,
                        'middle': indice_middle.average,
                        'special': indice_special.average
                    },
                    'selected': {
                        'all': indice_all.similar,
                        'high': indice_high.similar,
                        'middle': indice_middle.similar,
                        'special': indice_special.similar
                    }

                }

        own_values_by_sections = ValuesBySections()
        own_values_by_sections = consider_values_by_sections_for_indices_group(own_values_by_sections, instance)

        avg_values_by_sections = ValuesBySections()
        for subject in instance.subjects.all():
            try:
                indice: InstitutionIndice = InstitutionIndice.objects.get(subject=subject, chativa__name="all")
                avg_values_by_sections.all.append(indice.average)
            except:
                pass
            try:
                indice = InstitutionIndice.objects.get(subject=subject, chativa__name="high")
                avg_values_by_sections.high.append(indice.average)
            except:
                pass
            try:
                indice = InstitutionIndice.objects.get(subject=subject, chativa__name="special")
                avg_values_by_sections.special.append(indice.average)
            except:
                pass
            try:
                indice = InstitutionIndice.objects.get(subject=subject, chativa__name="middle")
                avg_values_by_sections.middle.append(indice.average)
            except:
                pass

        selected_values_by_sections = ValuesBySections()

        selected_institutions_ids: list = self.context.get('selected_institutions')
        if type(selected_institutions_ids) == list and len(selected_institutions_ids):
            selected_institutions_ids = self.context.get('selected_institutions')
            selected_institutions_indice_groups = IndiceGroup.objects.filter(

                name__id=instance.name.id,
                yearly_indice__institution__id__in=selected_institutions_ids
            )
            for group in list(selected_institutions_indice_groups):
                selected_values_by_sections = consider_values_by_sections_for_indices_group(selected_values_by_sections,
                                                                                            group)
        else:
            for subject in instance.subjects.all():
                try:
                    indice: InstitutionIndice = InstitutionIndice.objects.get(subject=subject, chativa__name="all")
                    selected_values_by_sections.all.append(indice.similar)
                except:
                    pass
                try:
                    indice = InstitutionIndice.objects.get(subject=subject, chativa__name="high")
                    selected_values_by_sections.high.append(indice.similar)
                except:
                    pass
                try:
                    indice = InstitutionIndice.objects.get(subject=subject, chativa__name="special")
                    selected_values_by_sections.special.append(indice.similar)
                except:
                    pass
                try:
                    indice = InstitutionIndice.objects.get(subject=subject, chativa__name="middle")
                    selected_values_by_sections.middle.append(indice.similar)
                except:
                    pass

        return {
            'own': {
                'high': own_values_by_sections.get_high_section_avg(),
                'middle': own_values_by_sections.get_middle_section_avg(),
                'all': own_values_by_sections.get_avg(),
                'special': own_values_by_sections.get_special_section_avg()
            },
            'average': {
                'high': avg_values_by_sections.get_high_section_avg(),
                'middle': avg_values_by_sections.get_middle_section_avg(),
                'all': avg_values_by_sections.get_avg(),
                'special': avg_values_by_sections.get_special_section_avg()
            },
            'selected': {
                'high': selected_values_by_sections.get_high_section_avg(),
                'middle': selected_values_by_sections.get_middle_section_avg(),
                'all': selected_values_by_sections.get_avg(),
                'special': selected_values_by_sections.get_special_section_avg()
            }
        }


class IndiceSubjectSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name.title')

    class Meta:
        model = IndiceSubject
        fields = ['name']


class AllYearsEducationIndiceSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField(required=True)
    subject_name_id = serializers.IntegerField(required=True)


class YearlyIndiceRequestSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField(required=True)
    year = serializers.CharField(required=True, max_length=4)
    selected_institutions = serializers.ListField(child=serializers.IntegerField(), required=False)


class DataTypeAvailableYears(serializers.Serializer):
    institution_id = serializers.IntegerField(required=True)
    data_type = serializers.CharField(required=True)
