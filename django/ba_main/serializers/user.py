from rest_framework import serializers

from ba_main.models.user import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', 'date_joined',)
        depth = 1


class ManagerSerializer(serializers.ModelSerializer):
    # role = serializers.CharField(source='role.name')

    class Meta:
        model = User
        fields = ['first_name', 'last_name']