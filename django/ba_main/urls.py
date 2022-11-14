from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

from ba_main.views.auth import change_password, login_view, is_auth, logout_view, forgot_password
from ba_main.views.conclusion import create_or_update_conclusion, get_conclusion
from ba_main.views.data_pulling import start_data_pulling
from ba_main.views.goal import get_institution_goals, update_yearly_goal, set_disable_editing_date
from ba_main.views.indices import get_yearly_education_indice, get_yearly_social_indices, get_yearly_staff_indice, \
    get_yearly_participation_indice, get_all_years_education_indice, get_data_type_available_years, \
    uploading_participation_data
from ba_main.views.institution import get_institution_list, update_story_and_strength, institutions_base_details, \
    get_indices_torani
from ba_main.views.institution_yearly_detail import get_institutions_details, patch_evaluation_fields, \
    get_yearly_institution_details_list
from ba_main.views.participation_indice import get_participation_indices, get_institute_participation
from ba_main.views.year import get_years

from ba_main.views.institution import institution_image
from ba_main.views.expect import create_or_update_expect, get_expect

urlpatterns = [
    # AUTH
    # path(r'', include(router.urls)),
    path(
        r'change_password',
        change_password,
        name='change_password'
    ),
    path(
        r'login',
        login_view,
        name='login'
    ),
    path(
        r'logout',
        logout_view,
        name='logout'
    ),
    path(
        r'is_auth',
        is_auth,
        name='is_auth'
    ),
    path(
        r'forgot_password',
        forgot_password,
        name='forgot_password'
    ),
    path(r'institution_image/<int:institution_id>',
         institution_image,
         name="institution_image"),

    #   INSTITUTIONS YEARLY DETAILS
    path(

        r'institution_details',
        include([
            path(r'',
                 get_institutions_details,
                 name='get_institution_details'
                 ),
            path(r'/story&strength',
                 update_story_and_strength,
                 name='update_story_and_strength'
                 ),
            path(r'/<int:institution_id>',
                 get_yearly_institution_details_list,
                 name='institution_details_list'
                 )
        ])

    ),
    #   EVALUATION FIELDS
    path(
        r'evaluation_fields/<int:institution_id>/<int:year_id>',
        patch_evaluation_fields,
        name='evaluation_fields'
    ),
    #   PARTICIPATION INDICES
    path(
        r'participation_indices/<int:institution_id>/<int:year_id>',
        get_participation_indices,
        name='institution_details'
    ),
    #   INSTITUTIONS LIST BY USER
    path(

        r'institutions',
        include([
            path(r'',  get_institution_list, name='institution_list_by_user'),
            path(r'/basic_details', institutions_base_details),
            path(r'/indice_torani',get_indices_torani)

        ])

    ),
    path(
        r'fetch_data',
        start_data_pulling
    ),
    #   YEARS LIST BY INSTITUTION
    path(
        r'years',
        get_years,
        name='year_list_by_institution'
    ),
    path(
        r'indices/',
        include([
            path(r'available_years', get_data_type_available_years),
            path(r'education',
                 include([
                     path(r'', get_yearly_education_indice),
                     path(r'/by_years', get_all_years_education_indice)
                 ])),

            path(r'social', get_yearly_social_indices),
            path(r'staff', get_yearly_staff_indice),
            path(r'participation', get_yearly_participation_indice),
            path(r'upload_participation_data', uploading_participation_data),
            path(r'conclusion', include([
                path(r'/update', create_or_update_conclusion),
                path(r'', get_conclusion)
            ])),
        ])
    ),
    path(r'goals',
         include(
             [
                 path('', get_institution_goals),
                 path(r'/update', update_yearly_goal),
                 path(r'/disable_editing_date', set_disable_editing_date)
             ])
         ),
    path(r'participation', get_institute_participation),
    path(r'expect', include([
        path(r'/update', create_or_update_expect),
        path(r'', get_expect)
    ])),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
