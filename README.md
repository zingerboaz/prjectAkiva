# Introduction

This project is a template for 'dockerized' web app project using Angular for the front-end server, Django for back-end and MySql for database. Therefore, not all the contents in this template are necessary/relevant and should be deleted/replaced based on the new project requirements, _**however**_  the file-structure cannot be changed in order for the docker environment to launch correctly. Therefore, please adhere to the instructions per folder.

## File Structure Requirements   

- The _angular_ folder must include a package.json file directly under it, ie. angular/package.json.
- The _django_ folder must include a **copy** of the manage.py file currently found django/manage.py.
-  The _docker_ folder and all its contents must remain **AS IS**. Additionally, a _requirements.txt_ file must be found and **populated correctly** directly under the _django_ folder. 
- Any SQL configurations that are needed at start up, for instance databases, tables, initialization data, must be included in the _mysql_ folder. The file that is there curentl y can be edited or removed.
- The _setup_ folder and all its contents must remain **AS IS**.
- All the files directly under the project root must remain **AS IS**.

How to launch a docker developer environment
--
Assuming docker is installed on your local machine, run the following command in your terminal:

`docker-compose -f docker-compose-dev.yml up -d`

If docker launched successfully, your angular server can be found at [http://localhost:4200](), and your dgango server at [http://localhost:8000](), and mysql server at [http://localhost:3306]().

**Please note, like in all docker projects, all internal api calls, i.e, server to server, must be referenced by their docker service name followed by their port number, for example http://django:8000. The service names are the names under 'services' in the docker-compose-dev.yml file.
This is unlike browser calls to the front-end server which will to the localhost, not the service.

## How to launch a docker production environment - _locally_.

- Comment out lines 10-16 and 38-43 in the docker/nginx-prod/ng-prod.conf file. 
- Replace line 10 with `listen 80;`
- Replace line 16 with `server_name localhost;`
- Make sure all the services in the dev environment are down by running
 
    `docker-compose -f docker-compose-dev.yml down`.
- Run `docker-compose -f docker-compose-prod.yml up -d`
- Check your app is running at your [localhost](http://localhost), which is default port 80.
 

 ## Create first Superuser
 --
 to seed first super user run:
 ```bash
    ./createSuperuser.sh
 ``` 
 or on windows:

 ```cmd
    ./createSuperuser.bat
 ```
## How to launch a docker production environment -on a _remote server_.
___
   To enable HTTPS on your website, you need certification from a CA (certification authority). [Letsencrypt](https://letsencrypt.org/) is a free certification authority service that provides certs that are valid for 90 days. To generate the certs follow the instructions:
- Run the `generate_domain.py` file in the project's root directory, and enter the domain name.
This will replace "{your_domain}" in all the configuration files with the correct domain.
-  In order to generate the certs, run the following command in your production server from the project root: 
    
    `python3 setup/prod/setup.py`
- In a browser verify the project is accessible with HTTP and HTTPS.
- The certifications authorized by Letsencrypt expire after 90 days. 
In order to renew the certs, go into the host machine and create a cron job to issue the renewal.
    1. Create the crontab file `crontab -e {filename}`
    2. You will be prompted to choose an editor, open the file and copy into the first open line 
    `0 */12 * * *  docker-compose -f docker-compose-setup-prod.yml run --rm letsencrypt /usr/bin/certbot renew
 && docker-compose -f docker-compose-prod.yml restart angular-nginx-prod`
 This will schedule to run every 12 hours to renew the certs and restart the nginx proxy with the new certificates.

## How to generate auto-renewals certs

___
-  Configure a crontab file.

   `crontab -e`
- After opening the file with an editor, paste the following into the last line of the file and save:
    
    `0 0 * * *   cd {path/to/your/project} && docker-compose -f docker-compose-setup-prod.yml run --rm letsencrypt /usr/bin/certbot renew  && docker-compose -f docker-compose-prod.yml restart angular-nginx-prod 
` 
- You can view the file with `crontab -l`
- If you want to view the output, either append to the end of the line in your cronjob the following:
    
    `>> /root/cert-renewal-logs/cert.log  2>&1`
    
- Or for more verbose output, set up a _local_ posix mailserver and check your mail. 
- To set up mail:
    
    `sudo apt-get update` 
       
    `sudo apt-get upgrade`
    
    `sudo apt-get install postfix`
    
    `sudo apt-get install mailutils`
    
- Check your mail after crontab runs with:

    ` echo p|mail`  
