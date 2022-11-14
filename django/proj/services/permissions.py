from rest_framework.permissions import BasePermission

from ba_main.models.user import User


class ManagerPermission(BasePermission):

    def has_permission(self, request, view):
        user = User.objects.get(email=request.user)
        return user.is_manager() or user.is_developer()


class AreaManagerPermission(BasePermission):

    def has_permission(self, request, view):
        user = User.objects.get(email=request.user)
        return user.is_area_manager() or user.is_developer()