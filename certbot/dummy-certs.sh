#!/bin/sh

domains=$SERVER_NAME
rsa_key_size=4096
data_path="/etc/letsencrypt"
email="" # Adding a valid address is strongly recommended
staging=1 # Set to 1 if you're testing your setup to avoid hitting request limits
mkdir -p "$data_path/conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "/etc/letsencrypt/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/etc/letsencrypt/ssl-dhparams.pem"

path="/etc/letsencrypt/live/$domains"

mkdir -p $path

openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 -keyout $path/privkey.pem -out $path/fullchain.pem -subj '/CN=localhost'

