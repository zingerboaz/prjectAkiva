#!/bin/bash

domains=($SERVER_NAME)
rsa_key_size=4096
email="" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

# Get the URL or Subdomain
url=($SERVER_NAME)
# Get the port after symbol :, if does not exist use the default port 443
port=$(echo "${url}" | awk -F':' '{ print $3 }')
if [ -z "${port}" ]; then
   port="443"
fi
# Get the final hostname because this URL might be redirected
final_hostname=$(curl "${url}" -Ls -o /dev/null -w %{url_effective} | awk -F[/:] '{ print $4 }')
# Use openssl to get the status of the host
status=$(echo | openssl s_client -connect "${final_hostname}:${port}" </dev/null 2>/dev/null | grep 'Verify return code: 0 (ok)')
if [ -n "${status}" ]; then
   echo "Site ${final_hostname} with port ${port} is valid https"
   exit 0
else
# check again if https exist 
if wget --spider https://$SERVER_NAME 2>/dev/null; then
  echo "https is present"
  exit 0
else
  echo "https not present"
fi
fi



# build certbot image
docker-compose -f docker-compose.yml build



echo "### Creating dummy certificate for $domains ..."

docker-compose run --rm --entrypoint "./dummy-certs.sh" certbot



echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"


echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo


echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo


