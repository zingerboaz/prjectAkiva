import json
from rest_framework import status
from django.test import TestCase, Client
from ba_main.models.user import User
from django.urls import reverse

# initialize the APIClient app
client = Client()


class UserAuthTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            first_name='chaim',
            last_name='vaidberg',
            username='chaim@gmail.com',
            email='chaim@gmail.com'
        )
        self.user.set_password('password')
        self.user.save()
        self.data = {
            'email': self.user.email,
            'password': 'password',
        }

    def test_not_auth_user(self):
        response = client.get(reverse('is_auth'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_200_returned(self):
        client.login(username='chaim@gmail.com', password='password')
        response = client.get(reverse('is_auth'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
