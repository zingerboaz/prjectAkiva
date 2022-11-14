FROM certbot/certbot

RUN apk --no-cache add curl

COPY ./certbot/dummy-certs.sh .

RUN chmod +x dummy-certs.sh

