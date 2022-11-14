from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view

from data_pulling.excel_data_fetching import InstitutionsExcelReader
from data_pulling.fetching import get_education_picture, get_institution_details
from ba_main.models.institution import Institution


@api_view(['POST'])
def start_data_pulling(request):
    print('stating data pulling')

    from django import forms
    class FetchingSiteDataForm(forms.Form):
        year = forms.CharField(required=True, max_length=4, min_length=4)

    form = FetchingSiteDataForm(request.POST, request.FILES)
    if not form.is_valid():
        return
    year_of_data = form.data.get('year')
    semels_list: list = Institution.objects.all()

    for semel in semels_list:
        try:
            get_institution_details(semel.semel, year_of_data)
            get_education_picture(semel.semel, year_of_data)
        except Exception as e:
            print(e)
            continue
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

