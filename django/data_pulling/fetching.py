import requests

from ba_main.models import InstitutionDetails, Year, YearlyIndice, IndiceType, Role
from ba_main.models.chativa import Chativa
from ba_main.models.group_name import GroupName
from ba_main.models.indice import InstitutionIndice
from ba_main.models.indice_group import IndiceGroup
from ba_main.models.indice_subject import IndiceSubject
from ba_main.models.indice_type import YearlyIndiceTypes
from ba_main.models.institution import Institution
from ba_main.models.institution_backup import InstitutionBackup
from ba_main.models.subject_name import SubjectName
from ba_main.models.user import User
from data_pulling.vars import REMOTE_API_URL, DATA_API_URL
import traceback


def get_education_picture(semel_mosad: str, backup_year):
    # print(semel_mosad)
    mosad_data: dict = {}
    institution = Institution.objects.get(semel=semel_mosad)
    success = False
    counter = 0
    while not success and counter < 5:
        response = requests.get(REMOTE_API_URL.get(DATA_API_URL.EDUCATION_PIC), params={'semelMosad': semel_mosad})
        counter = counter + 1
        try:
            mosad_data = response.json()

            success = True
        except Exception as e:
            print(e)

    if not success:
        print(traceback.format_exc())
        return

    institution_backup, ins_bckp_created = InstitutionBackup.objects \
        .get_or_create(semel=institution.semel, year=backup_year)
    try:
        if not institution_backup.education_picture:
            institution_backup.education_picture = response.json()
            institution_backup.save()

    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return

    insert_indexes_to_db_from_json(semel_mosad, mosad_data)


def insert_indexes_to_db_from_json(semel_mosad: str, mosad_data):
    print("insert", semel_mosad)
    institution = Institution.objects.get(semel=semel_mosad)
    # print(institution)
    mosad_groups = mosad_data.get('groups')
    #  paths
    #  /Classes/Name - hativa
    #  in Indexes :  /Year - year
    #                /Name - group name
    #                /Statements - subjects
    # in Subjects : /Name - subject name
    #               /Value - index value
    #               /CompareValuesModel[1] - similar institutions
    #
    for group in mosad_groups:
        try:
            # #print('group_name', group.get('Name'))

            yearly_indice_type_from_data: IndiceType
            yearly_indice_type_from_data_staff_2: IndiceType = None
            #
            indice_group_name_is_only_value = group.get('Name').find('בגרות') != -1
            if group.get('Name') == 'התמדה ונשירה':
                indice_group_name_is_only_value = group.get('Name').find('התמדה') != -1

            # print("group name : " + group.get('Name'))
            if group.get('Name') == 'ערכים ואקלים חינוכי':
                yearly_indice_type_from_data, yit_created = IndiceType.objects.get_or_create(name='SOCIAL',
                                                                                             defaults={
                                                                                                 'name': 'SOCIAL'})
            elif group.get('Name') == 'בגרות' or group.get('Name') == 'התמדה ונשירה':
                yearly_indice_type_from_data, yit_created = IndiceType.objects.get_or_create(name='EDUCATION',
                                                                                             defaults={
                                                                                                 'name': 'EDUCATION'})
            elif group.get('Name') == 'למידה':
                yearly_indice_type_from_data, yit_created = IndiceType.objects.get_or_create(name='EDUCATION',
                                                                                             defaults={
                                                                                                 'name': 'EDUCATION'})
            elif group.get('Name') == 'הצוות החינוכי':
                yearly_indice_type_from_data, yit_created = IndiceType.objects.get_or_create(name='STAFF',
                                                                                             defaults={'name': 'STAFF'})
                yearly_indice_type_from_data_staff_2, yit_created_staff_2 = IndiceType.objects.get_or_create(
                    name='STAFF_2',
                    defaults={
                        'name': 'STAFF_2'})

            classes = group.get('Classes')
            if not classes or not len(classes):
                continue

            for klass in classes:
                try:
                    # #print('klass keys', klass.keys())
                    classes_range = klass.get('Name')
                    chativa = None
                    special_education = False

                    if classes_range == "כיתות י' - י\"ב" or classes_range == "חטיבה עליונה":
                        chativa, ct_created = Chativa.objects.get_or_create(name='high', defaults={'name': 'high'})

                    elif classes_range == "חטיבת ביניים":
                        chativa, ct_created = Chativa.objects.get_or_create(name='middle', defaults={'name': 'middle'})

                    elif group.get('Name') == 'בגרות' and classes_range == 'כן':
                        chativa, ct_created = Chativa.objects.get_or_create(name='special', defaults={'name': 'special'})
                        special_education = True
                    else:
                        chativa, ct_created = Chativa.objects.get_or_create(name='all', defaults={'name': 'all'})


                    group_indexes = klass.get('Indexes')
                    for index in group_indexes:
                        try:
                            index_id = index.get('Id')
                            # print(f'Index Id -> {index_id}')

                            if index_id.find('GIUS') >= 0:
                                # #print('Now In GIUS')
                                continue

                            # print(index.get('Name'))
                            # print(len(index.get('Name')))
                            # print(index.get('Name').__contains__('טכנולוג'))
                            if index.get('Name').__contains__('טכנולו') \
                                    and len(index.get('Name')) > len('זכאים להסמכה טכנולוגית') + 1:
                                # print('continue')
                                continue
                            else:
                                pass
                                # print('technologie to add')
                            # GROUP NAME Creating or Updating
                            year_name_from_data = str(index.get('Year'))
                            year_hebrew_name_from_data = index.get('HebYear')
                            year_args = {'name': year_name_from_data, 'hebrew_name': year_hebrew_name_from_data}
                            year, y_created = Year.objects.update_or_create(name=year_name_from_data,
                                                                            defaults=year_args)

                            # YEARLY INDICE Creating or Updating
                            yearly_indice_args = {
                                'type': yearly_indice_type_from_data,
                                'year': year,
                                'institution': institution}
                            yearly_indice, yi_created = YearlyIndice.objects.update_or_create(
                                type__id=yearly_indice_type_from_data.id,
                                year__id=year.id,
                                institution__id=institution.id,
                                defaults=yearly_indice_args
                            )

                            if yearly_indice_type_from_data_staff_2 is not None:
                                # YEARLY INDICE Creating or Updating for staff_2 (staff comment)
                                yearly_indice_args_staff_2 = {
                                    'type': yearly_indice_type_from_data_staff_2,
                                    'year': year,
                                    'institution': institution}
                                yearly_indice_staff_2, yi_created_staff_2 = YearlyIndice.objects.update_or_create(
                                    type__id=yearly_indice_type_from_data_staff_2.id,
                                    year__id=year.id,
                                    institution__id=institution.id,
                                    defaults=yearly_indice_args_staff_2
                                )

                            # GROUP NAME Creating or Updating
                            data_indice_group_name = ''
                            data_indice_group_name: str = index.get('Name')
                            group_name_args = {'title': data_indice_group_name}

                            indice_group_name, ign_was_created = GroupName \
                                .objects \
                                .get_or_create(title=data_indice_group_name, defaults=group_name_args)

                            # #print('Indice Group Name Created ', ign_was_created, indice_group_name.title)

                            # GROUP Creating or Updating

                            indice_group_args = \
                                {
                                    'name': indice_group_name,
                                    'yearly_indice': yearly_indice
                                }

                            indice_group, ig_was_created = IndiceGroup. \
                                objects \
                                .update_or_create(
                                name__id=indice_group_name.id,
                                yearly_indice__id=yearly_indice.id,
                                defaults=indice_group_args)
                            # print('indice group', indice_group)

                            # #print('Indice Group Created ', ig_was_created)
                            # #print(indice_group.name.title)
                            index_statements = index.get('Statements')
                            # if index_id in ['ACHUZ_ZAK_TECH_KLALI']:
                            #     index_statements = index.get('Statements')

                            if not index_statements:
                                # Should save actual values
                                acceptable_indexes = [
                                    'TALMUD',
                                    'MISHNA',
                                    'TANAKH',
                                    'MAHCHEVET',
                                    'ACHUZ_ZAKAIM',
                                    'ACHUZ_ZAKAIM_MITZTYEN',
                                    'ACHUZ_MACHB_PSULOT',
                                    'ACHUZ_ANGLIT_4YL',
                                    'ACHUZ_ANGLIT_5YL',
                                    'ACHUZ_MATEM_4YL',
                                    'ACHUZ_MATEM_5YL',
                                    'ACHUZ_NESHIRA',
                                    'ACHUZ_MATMID',
                                    # 'ACHUZ_ZAK_TECH_KLALI'
                                ]
                                if not index_id in acceptable_indexes:
                                    continue
                                index_statements = index.get('History')
                                # #print(f'Now In History {len(index_statements)} length')

                            for statement in index_statements:

                                try:
                                    data_subject_name = ''
                                    # #print(f'{index_id} ONLY VALUE ? {indice_group_name_is_only_value}')
                                    if not indice_group_name_is_only_value:
                                        # print("1")
                                        data_subject_name: str = statement.get('Name')
                                        # #print(index_id, 'NOT ONLY VALUE')
                                    else:
                                        # print('2')
                                        # In History object structure different
                                        #########################################
                                        #########################################
                                        # #print(index_id, 'SHOULD BE ONLY VALUE')
                                        data_subject_name: str = 'ONLY_VALUE'

                                        # GROUP NAME Creating or Updating
                                        year_name_from_data = str(statement.get('Year'))
                                        year_hebrew_name_from_data = statement.get('HebYear')
                                        year_args = {'name': year_name_from_data,
                                                     'hebrew_name': year_hebrew_name_from_data}
                                        year, y_created = Year.objects.update_or_create(name=year_name_from_data,
                                                                                        defaults=year_args)

                                        # YEARLY INDICE Creating or Updating
                                        yearly_indice_args = {
                                            'type': yearly_indice_type_from_data,
                                            'year': year,
                                            'institution': institution}

                                        # print("3")
                                        yearly_indice, yi_created = YearlyIndice.objects.update_or_create(
                                            type__id=yearly_indice_type_from_data.id,
                                            year__id=year.id,
                                            institution__id=institution.id,
                                            defaults=yearly_indice_args
                                        )
                                        # print('4')
                                        # group_name_args = {'title': data_indice_group_name}
                                        # indice_group_name, ign_was_created = GroupName \
                                        #     .objects \
                                        #     .get_or_create(title=data_indice_group_name, defaults=group_name_args)
                                        # #print('Indice Group Name Created ', ign_was_created, indice_group_name.title)

                                        # GROUP Creating or Updating

                                        indice_group_args = \
                                            {
                                                'name': indice_group_name,
                                                'yearly_indice': yearly_indice
                                            }
                                        indice_group, ig_was_created = IndiceGroup. \
                                            objects \
                                            .update_or_create(
                                            name__id=indice_group_name.id,
                                            yearly_indice__id=yearly_indice.id,
                                            defaults=indice_group_args)
                                        #################################################

                                    # print("5")
                                    subject_name_args = {'title': data_subject_name}
                                    # print(group.get('Name'), data_subject_name)
                                    # SUBJECT NAME Creating or Updating
                                    subject_name, sn_created = SubjectName.objects.get_or_create(
                                        title=data_subject_name, defaults=subject_name_args)
                                    # print("subject name", subject_name)
                                    # SUBJECT Creating or Updating
                                    subject_args = {'name': subject_name, 'indice_group': indice_group}
                                    subject, subject_created = IndiceSubject.objects \
                                        .update_or_create(name__id=subject_name.id, indice_group__id=indice_group.id,
                                                          defaults=subject_args)
                                    # print(subject)
                                    index_values_from_data = statement.get('CompareValuesModel')
                                    # if group.get('Name') == 'התמדה ונשירה':

                                    index_values_args = \
                                        {
                                            'value': index_values_from_data[0].get('Value'),
                                            'similar': index_values_from_data[1].get('Value'),
                                            'average': index_values_from_data[2].get('Value'),
                                            'subject': subject,
                                            'special_education': special_education,
                                            'chativa': chativa
                                        }
                                    # print(index_values_args)
                                    # filterd_index_values = list(InstitutionIndice.objects \
                                    #     .filter(
                                    #     subject__id=subject.id,
                                    #     subject__indice_group__id=indice_group.id))

                                    # #print('Index ids found:')
                                    # for index in filterd_index_values:
                                    #     #print(index.id)
                                    index_value, iv_created = InstitutionIndice.objects \
                                        .update_or_create(
                                        subject__id=subject.id,
                                        subject__indice_group__id=indice_group.id,
                                        subject__indice_group__yearly_indice__id=yearly_indice.id,
                                        chativa__id=chativa.id,
                                        defaults=index_values_args)
                                    # print(index_value)
                                    # print("9", chativa.name)
                                except Exception as e:
                                    continue
                        except Exception as e:
                            continue
                except Exception as e:
                    continue
        except Exception as e:
            continue


def get_institution_details(semel_mosad: str, request_year: int) -> Institution:
    # get_education_picture(semel_mosad)

    success = False
    counter = 0
    mosad_details_data: dict
    while not success and counter < 5:
        response = requests.get(
            REMOTE_API_URL.get(DATA_API_URL.INSTITUTION_DETAILS),
            params=
            {
                'semelMosad': semel_mosad,
                'year': request_year
            })
        counter = counter + 1
        try:
            mosad_details_data = response.json()
            success = True
        except Exception as e:
            print(e)

    if not success:
        # print(traceback.format_exc())
        return

    institution_backup_args = {
        'year': request_year,
        'semel': semel_mosad,
        'institution_details': mosad_details_data
    }

    institution_backup, inb_created = InstitutionBackup.objects \
        .get_or_create(
        semel=semel_mosad,
        year=request_year, defaults=institution_backup_args)
    if not inb_created:
        if not institution_backup.institution_details:
            institution_backup.save()

    # #print('Mosad Details',mosad_details_data)
    # #print('Mosad Details Keys', mosad_details_data.keys())

    mosad_general_data = mosad_details_data.get('mosadGenaralData')
    # #print('Mosad General Data Keys', mosad_general_data.keys())

    institution_name = mosad_general_data.get('SHEM_MOSAD')
    institution_semel = mosad_general_data.get('SEMEL_MOSAD')
    institution_args = {'name': institution_name, 'semel': institution_semel}
    # #print('SEMEL MOSAD -> ', institution_semel)
    institution, inst_created = Institution.objects \
        .get_or_create(semel=institution_semel,
                       defaults=institution_args
                       )

    mosad_yearly_data: dict = mosad_details_data.get('mosadYearData')
    mosad_shichva_data: list = mosad_details_data.get('mosadKitotLeshichvaData')
    special_classes_num = 0
    for x in mosad_shichva_data:
        if x.get('TEUR_SHICHVA') == "סה\"כ":
            special_classes_num = x.get('KITOT_PER_SHICVA_MEYU', 0)
            break

    num_of_students = mosad_yearly_data.get('BANOT', 0) + mosad_yearly_data.get('BANIM', 0)
    num_of_teachers = mosad_yearly_data.get('MOROT', 0) + mosad_yearly_data.get('MORIM', 0)
    num_of_classes = mosad_yearly_data.get('SACH_KITOT_MOSAD')

    student_integration_from_data = mosad_yearly_data.get('MADAD_CHINUCH_MEYUCHAD', 0)

    # #print('num_of_classes', num_of_classes)
    # #print('num_of_teachers', num_of_teachers)
    # #print('num_of_students', num_of_students)

    data_year = mosad_yearly_data.get('SHANA_LOAZITH')
    year, year_created = Year.objects.update_or_create(name=data_year)
    institution_details_args = {
        'num_of_student': num_of_students,
        'num_of_teacher': num_of_teachers,
        'num_of_class': num_of_classes,
        'year': year,
        'institution': institution,
        'num_of_special_class': special_classes_num,
        'student_integration': student_integration_from_data
    }

    institution_details, id_created = InstitutionDetails.objects.update_or_create(
        institution__id=institution.id,
        year__id=year.id, defaults=institution_details_args)
    # #print('Institution Details Created', id_created)

    return institution

#     mosadGenaralData/
#                       SEMEL_MOSAD ,
#                       SHEM_MOSAD,
#     mosadYearData/
#                      SHANA_LOAZITH,
#                      MOROT + MORIM,
#                      BANOT + BANIM
#                      SACH_KITOT_MOSAD,
#                      SHEM_MENAHEL_YY

#
