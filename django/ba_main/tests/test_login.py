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

    def test_200_returned(self):
        # get API response
        response = client.post(reverse('login'), data=json.dumps(self.data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_required_field(self):
        response = client.post(reverse('login'), data=json.dumps({}), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_format(self):
        data = {
            'email': '123',
            'password': 'password'
        }
        response = client.post(reverse('login'), data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_incorrect_password(self):
        data = {
            'email': 'chaim@gmail.com',
            'password': 'incorrect'
        }
        response = client.post(reverse('login'), data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_details(self):
        response = client.post(reverse('login'), data=json.dumps(self.data), content_type='application/json')
        response_data = {
            'user': {
                'id': self.user.pk,
                'name': "{} {}".format(self.user.first_name, self.user.last_name),
                'is_change_password_required': self.user.is_change_password_required
            }
        }
        self.assertEqual(response.data, response_data)
