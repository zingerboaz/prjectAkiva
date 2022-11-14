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
            'old_password': 'password',
            'new_password': 'newpassword'
        }

        
    def test_not_auth_user(self):
        # get API response
        response = client.put(reverse('change_password', kwargs={'user_id': self.user.pk}), data=json.dumps(self.data),
                              content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_200_returned(self):
        client.login(username='chaim@gmail.com', password='password')
        # get API response
        response = client.put(reverse('change_password', kwargs={'user_id': self.user.pk}), data=json.dumps(self.data),
                              content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_passowrd_has_been_changed(self):
        client.login(username='chaim@gmail.com', password='password')

        response = client.put(reverse('change_password', kwargs={'user_id': self.user.pk}), data=json.dumps(self.data),
                              content_type='application/json')
        self.user.refresh_from_db()
        is_valid = self.user.check_password(self.data['new_password'])
        self.assertEqual(is_valid, True)

    def test_required_field(self):
        client.login(username='chaim@gmail.com', password='password')

        response = client.put(reverse('change_password', kwargs={'user_id': self.user.pk}), data=json.dumps({}),
                              content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_incorrect_old_password(self):
        client.login(username='chaim@gmail.com', password='password')

        data = {
            'old_password': 'incorrect',
            'new_password': 'newpassword'
        }
        response = client.put(reverse('change_password', kwargs={'user_id': self.user.pk}), data=json.dumps(data),
                              content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'old_password': ['Wrong password.']})

    def test_is_change_password_required_has_been_changed(self):
        client.login(username='chaim@gmail.com', password='password')
        # get API response
        response = client.put(reverse('change_password', kwargs={'user_id': self.user.pk}), data=json.dumps(self.data),
                              content_type='application/json')
        self.user.refresh_from_db()
        self.assertEqual(self.user.is_change_password_required, False)
