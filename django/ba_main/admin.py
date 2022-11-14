from django.contrib import admin
from django.contrib.auth.models import Group
from django.forms import ValidationError
from django.forms.models import BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _

from .models import Year, \
    InstitutionDetails, InstitutionsGroup, YearlyGoal, \
    ActionWay, Milestone, YearlyIndice, Role, IndiceType, Conclusion, InstitutionProgram
# User as InstitutionUser, \
from .models.chativa import Chativa
from .models.group_name import GroupName
from .models.indice import InstitutionIndice
from .models.indice_group import IndiceGroup
from .models.indice_subject import IndiceSubject
from .models.institution import Institution
from .models.participation_context import ParticipationContext
from .models.participation_details import ParticipationDetails
from .models.participation_subject import ParticipationSubject
from .models.subject_name import SubjectName
from .models.user import User
from .views.data_pulling import start_data_pulling


class UserInlineFormSet(BaseInlineFormSet):
    """
    Generates an inline formset that is required
    """

    def clean(self):
        # get forms that actually have valid data
        count = 0
        for form in self.forms:
            try:
                if form.cleaned_data:
                    count += 1
            except AttributeError:
                # annoyingly, if a subform is invalid Django explicity raises
                # an AttributeError for cleaned_data
                pass
        if count < 1:
            raise ValidationError(_('You must have at least one user'))

        super(UserInlineFormSet, self).clean()


class ManagerInline(admin.TabularInline):
    model = User
    fields = ('email', 'first_name', 'last_name')
    extra = 0
    formset = UserInlineFormSet
    fk_name = 'institution'
    # can_delete = False
    # readonly_fields = ['username', 'first_name', 'last_name']

    # def has_add_permission(self, request):
    #     return False

class AreaMangerInline(admin.TabularInline):
    model = User
    fields = ('email', 'first_name', 'last_name')
    extra = 0
    formset = UserInlineFormSet
    fk_name = 'area_manager'

class YearlyGoalsAdminModel(admin.ModelAdmin):
    list_display = ('id', 'scope', 'year', 'institution', 'edit_expiration')
    search_fields = ('year',)
    change_list_template = 'admin/goals/goals_change_list.html'


def fetch_institutions_data(modeladmin, request, queryset):
    start_data_pulling(request)
fetch_institutions_data.short_description = "Fetch Institutions Data"


class InstitutionAdminModel(admin.ModelAdmin):
    # inlines = [ManagerInline]
    list_display = ('id','semel','name','manager', 'area_manager', 'image')
    search_fields = ('name','semel')
    change_list_template = 'admin/institutions/institutions_change_list.html'
    # fields = ('name',)
    # readonly_fields = ['admin_thumbnail']


class InstitutionInline(admin.TabularInline):
    model = Institution
    fields = ('name',)
    extra = 0
    can_delete = False
    readonly_fields = ['name']

    def has_add_permission(self, request):
        return False

class UserAdminModel(admin.ModelAdmin):
    list_display = ['email','first_name','last_name', 'get_institution', 'role']
    fields = ('first_name', 'last_name', 'email', 'phone', 'mobile', 'role', 'is_superuser')
    search_fields = ('email', 'first_name', 'last_name')

    def get_institution(self, instance: User):
        return Institution.objects.get(manager__id=instance.id)

    get_institution.short_description = 'Institution'

class YearlyIndiceAdminModel(admin.ModelAdmin):
    list_display = ['institution', 'type', 'year']
    search_fields = ['institution__name']

class IndiceGroupAdminModel(admin.ModelAdmin):
    search_fields = ('name__title',)


class IndicesModelAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'subject_name',
        'group_name',
        'value',
        'similar',
        'average',
        'special_education',
        'chativa_name']
    search_fields = ('chativa__name',)
    change_list_template = 'admin/indices/indices_change_list.html'




admin.site.site_header = 'Bnei Akiva admin'
admin.site.index_title = 'Bnei Akiva administration'

admin.site.register(Institution, InstitutionAdminModel)
admin.site.register(User, UserAdminModel)
admin.site.register(InstitutionIndice, IndicesModelAdmin)
admin.site.register(InstitutionDetails)
admin.site.register(InstitutionProgram)
admin.site.register(Year)
admin.site.register(InstitutionsGroup)
admin.site.register(YearlyGoal, YearlyGoalsAdminModel)
admin.site.register(ActionWay)
admin.site.register(Milestone)
admin.site.register(YearlyIndice, YearlyIndiceAdminModel)
admin.site.register(Role)
admin.site.register(IndiceType)
admin.site.register(Conclusion)
admin.site.register(Chativa)
admin.site.register(IndiceGroup, IndiceGroupAdminModel)
# admin.site.register(ParticipationSubject)
# admin.site.register(ParticipationDetails)
# admin.site.register(ParticipationContext)
admin.site.register(IndiceSubject)
admin.site.register(SubjectName)
admin.site.register(GroupName)

admin.site.unregister(Group)


# TODO remove this automation
# app = apps.get_app_config('ba_main')
# for model_name, model in app.models.items():
#     if model == User or model == Institution:
#         continue
#     admin.site.register(model)
