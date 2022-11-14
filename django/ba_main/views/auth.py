from __future__ import unicode_literals

from django.contrib.auth.models import AnonymousUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from ba_main.models.institution import Institution
from ba_main.models.user import User
from ba_main.serializers.auth import PasswordSerializer, LoginSerializer, ForgotPasswordSerializer
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout

from ba_main.serializers.institution import SingleInstitutionSerializer, InstitutionSerializer
from ba_main.serializers.user import UserSerializer
from proj.const import SYSTEM_EMAIL
from proj.services import EmailService
from proj.utils import random_with_N_digits


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = PasswordSerializer(data=request.data)

    if serializer.is_valid():
        print('email', request.user.email, 'password', serializer.data.get('old_password'))
        user = authenticate(email=request.user.email, password=serializer.data.get('old_password'))

        if not user:
            return Response({'details': _('Wrong old password')},
                            status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.data.get('new_password'))
        user.is_change_password_required = False
        user.save()

        return Response({'details': _('Password has been successfully changed')},
                        status=status.HTTP_201_CREATED)

    return Response(serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([BasePermission])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        user = authenticate(email=serializer.data.get('email'), password=serializer.data.get('password'))
        if user:
            if user.is_active:
                login(request._request, user)
                current_user = User.objects.get(email=user.email)
                serializer = UserSerializer(current_user)
                response_data = {'user': serializer.data}
                if current_user.is_manager():
                    user_institution = Institution.objects.get(manager__id=current_user.id)
                    institution_result = SingleInstitutionSerializer(user_institution)
                    response_data['institution'] = institution_result.data
                elif current_user.is_area_manager():
                    user_all_institutions = Institution.objects.filter(area_manager__id=current_user.id)
                    all_institutions_result = InstitutionSerializer(user_all_institutions, many=True)
                    response_data['institutions_list'] = all_institutions_result.data
                elif current_user.is_developer():
                    user_all_institutions = Institution.objects.all()
                    all_institutions_result = InstitutionSerializer(user_all_institutions, many=True)
                    response_data['institutions_list'] = all_institutions_result.data
                return Response(response_data, status=status.HTTP_200_OK)

        return Response({'msg', _('UNAUTHORIZED')},
                        status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def logout_view(request):
    if type(request.user) is AnonymousUser:
        return Response({'loggedOut': False, 'details': 'You are already logged out'})
    try:
        logout(request)
        return Response({'loggedOut': True}, status=status.HTTP_200_OK)
    except Exception as inst:
        return Response({'loggedOut': False, 'details': inst.args})




@api_view(['GET'])
def is_auth(request):
    if not type(request.user) is AnonymousUser:
        return Response({'loggedIn': True})
    else:
        return Response({'loggedIn': False})



@api_view(['POST'])
@permission_classes([BasePermission])
def forgot_password(request):
    serializer = ForgotPasswordSerializer(data=request.data)

    if serializer.is_valid():
        user = User.objects.get(email=serializer.data.get('email'))

        if user:
            new_pass = User.objects.make_random_password()
            EmailService.send_email_template(
                _('סיסמתך הזמנית לאתר בני עקיבא'),
                SYSTEM_EMAIL,
                [user.email],
                'forgot_password.html',
                ({
                    'name': "{} {}".format(user.first_name, user.last_name),
                    'email': user.email,
                    'role_name': user.role.name,
                    'pass': new_pass})
            )
            user.set_password(new_pass)
            user.is_change_password_required = True
            user.save()
            return Response({'details': _('The temporary password has been send successfully')},
                            status=status.HTTP_201_CREATED)

        else:
            return Response({'details': _('This email is not configured for an existing user')},
                            status=status.HTTP_404_NOT_FOUND)

    return Response({ 'details': serializer.errors },
                    status=status.HTTP_400_BAD_REQUEST)
