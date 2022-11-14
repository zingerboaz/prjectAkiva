from django.urls import include, path
from django.contrib import admin
# from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
# from rest_framework.urlpatterns import format_suffix_patterns
# from ba_main import views
from  ba_main import urls



urlpatterns = [
    path(r'django/', include([
        path(r'api/v1/', include(urls)),
    # path(r'api/api-token-auth/', obtain_jwt_token),
    # path(r'api/api-token-refresh/', refresh_jwt_token),
    # path('api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
        path(r'admin/', admin.site.urls)
    ]))
]
