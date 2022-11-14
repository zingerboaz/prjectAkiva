from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.translation import ugettext_lazy as _
from smtplib import SMTPException

from rest_framework import serializers


class EmailService:
  
   @staticmethod 
   def send_email_template(subject, from_email, to_emails, template_uri, template_args):
       
        html_content = render_to_string(template_uri, template_args)
        print(subject, from_email, to_emails, from_email)
        try:
            emailMessage = EmailMultiAlternatives(subject=subject, from_email=from_email, to=to_emails, reply_to=[from_email,])
            emailMessage.attach_alternative(html_content, "text/html")
            emailMessage.send(fail_silently=False)

        except SMTPException as e:
            print(_('There was an error sending an email: '), e) 
            error = {'message': ",".join(e.args) if len(e.args) > 0 else _('Unknown Error')}
            raise serializers.ValidationError(error)