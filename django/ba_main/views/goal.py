from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ba_main.models import YearlyGoal
from ba_main.models.institution import Institution
from ba_main.serializers.goal import YearlyGoalSerializer, InstitutionYearlyGoalsSerializer, \
    InstitutionYearlyGoalsSaveSerializer
from ba_main.views.indices import fetch_indice_args_from_request


# @api_view(['POST'])
# def get_institution_goals(request):
#     request_data = fetch_indice_args_from_request(request)
#     yearly_goal = YearlyGoal.objects.filter(
#         year__name=request_data.get('year'),
#         institution_id=request_data.get('institution_id'))
#     yearly_goal_response = YearlyGoalSerializer(yearly_goal, many=True)
#     return Response(yearly_goal_response.data)
from proj.utils import Utils


@api_view(['POST'])
def get_institution_goals(request):
    print('request.data',request.data)
    institution = Institution.objects.get(id=request.data.get('institution_id'))
    yearly_goal_response = InstitutionYearlyGoalsSerializer(institution, context={'year_name': request.data.get('year_name')})
    return Response(yearly_goal_response.data)


@api_view(['PUT'])
def update_yearly_goal(request):
    goal_save_serializer = InstitutionYearlyGoalsSaveSerializer(data=request.data)
    if not goal_save_serializer.is_valid():
        return Utils.create_invalid_data_error_response(request.data, goal_save_serializer.errors)
    goal_save_serializer.save()
    return Response({
        'status': 'Institution yearly goals were update successfully',
        # 'data': goal_serializer.data
    })

@api_view(['POST'])
def set_disable_editing_date(request):
    from django import forms
    class SetExpirationEditingDateForm(forms.Form):
        expiration_date = forms.DateField()

    form = SetExpirationEditingDateForm(request.POST, request.FILES)
    if not form.is_valid():
        return
    print('Expiration Date', form.data.get('expiration_date'))
    YearlyGoal.objects.all().update(edit_expiration=form.data.get('expiration_date'))
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
