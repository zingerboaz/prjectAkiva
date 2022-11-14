echo "*************************"
echo "*** create super user ***"
echo "*************************"
docker-compose -f docker-compose-produp.yml exec  bneiakiva-django bash -c "python manage.py createsuperuser"