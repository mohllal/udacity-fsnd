# Linux Server Configuration
A baseline installation of Ubuntu Linux on a virtual machine to host a Flask web application. This includes the installation of updates, securing the system from a number of attack vectors and installing/configuring web and database servers.

This is my project for the [Udacity's Full Stack Web Developer Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004) courses [Configuring Linux Web Servers](https://www.udacity.com/courses/configuring-linux-web-servers--ud299) and [Linux Command Line Basics](https://www.udacity.com/courses/linux-command-line-basics--ud595).

Project Name: Linux Server Configuration.

## Server Details:
Public IP address: http://54.68.163.228
Public DNS hostname: http://ec2-54-68-163-228.us-west-2.compute.amazonaws.com
SSH port: 2200.
User: grader.
Remote server: [Amazon AWS EC2](https://aws.amazon.com/ec2/).
Private key: not provided here.

**Note**: Since I have now graduated, the original server has been disabled. You might find something else there now, but what follows would apply when setting up a new server.

#### 1. Packages Updates:
References:
- [How to install updates via command line in Ubuntu?](https://askubuntu.com/questions/196768/how-to-install-updates-via-command-line)
- [How do I enable automatic updates?](https://askubuntu.com/questions/9/how-do-i-enable-automatic-updates)

Steps:
1. Update the list of available packages and their versions:
    ```bash
    sudo apt-get update
    ```
2. Install newer vesions of installed packages:
    ```bash
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```
3. Install the ```unattended-upgrades``` package to allow automatic security updates:
    ```bash
    sudo apt-get install unattended-upgrades
    ```
4. Enable the ```unattended-upgrades``` package:
    ```bash
    sudo dpkg-reconfigure --priority-low unattended-upgrades
    ````

#### 2. User Management:
References:
- [How to add and delete users on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-an-ubuntu-14-04-vps).
- [What is the difference between adduser and useradd?](https://askubuntu.com/questions/345974/what-is-the-difference-between-adduser-and-useradd)

Steps:
1. Create new user with the name ```grader```:
    ```bash
    sudo adduser grader 
    ```
2. Run the following command:
    ```bash
    sudo visudo
    ```
3. Grant a user sudo privileges by locating the following line ```root    ALL=(ALL:ALL) ALL``` and append ```grader ALL=(ALL:ALL) ALL```:
    ```bash
    root   ALL=(ALL:ALL) ALL
    grader ALL=(ALL:ALL) ALL
    ```
5. In the local machine run the following command to generate key pairs:
    ```bash
    ssh-keygen
    ```
4. Make a ```.ssh``` directory:
    ```bash
    su - grader
    mkdir .ssh
    ```
5. Create public keys special file and add the ```grader``` public key to it:
    ```bash
    touch .ssh/authorized_keys
    nano .ssh/authorized_keys
    ```
6. Change file permission:
    ```bash
    chmod 700 .ssh
    chmod 644 .ssh/authorized_keys
    ```
7. Restart SSH service:
    ```bash
    service ssh restart
    ```

#### 3. SSH Configurations:
References:
- [Is it worth to change ssh server’s default port?](https://major.io/2013/05/14/changing-your-ssh-servers-port-from-the-default-is-it-worth-it/)
- [Disable ssh login for the root user](https://mediatemple.net/community/products/dv/204643810/how-do-i-disable-ssh-login-for-the-root-user).
- [Configure SSH key-based authentication on a Linux server](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server).

Steps:
1. Run the following command:
    ```bash
    sudo nano /etc/ssh/sshd_config
    ```
2. Change the SSH default port by locating the following line and change ```22``` to ```2200```:
    ```bash
    # What ports, IPs and protocols we listen for
    Port 22
    ```
3. Remove root login by locating the following line and change ```without-password``` to ```no```:
    ```bash
    # Authentication:
    PermitRootLogin without-password
    ```
4. Force SSH login by locating the following line and change ```yes``` to ```no```:
    ```bash
    # Change to no to disable tunnelled clear text passwords
    PasswordAuthentication yes
    ```
5. Restart the ssh service for the changes to take effect:
    ```bash
    sudo service ssh restart
    ```

#### 4. Firewall (UFW) Configurations:
References:
- [How to set up a firewall with UFW on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-14-04).
- [How to protect SSH with fail2Ban on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-14-04).

Steps:
1. Set UFW defaults:
    ```bash
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    ```
2. Allow connections for SSH (port 2200), HTTP (port 80), and NTP (port 123):
    ```bash
    sudo ufw allow 2200
    sudo ufw allow 80
    sudo ufw allow 123
    ```
3. Enable UFW:
    ```bash
    sudo ufw enable 
    ```
4. Install ```fail2ban``` package to block IP addresses that fail to correctly log in multiple times (brute force attack):
    ```bash
    sudo apt-get install fail2ban
    ```
5. Copy the default config file ```/etc/fail2ban/jail.conf```:
    ```bash
    sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
    ```
6. Open the local config file ```/etc/fail2ban/jail.local```:
    ```bash
    sudo nano /etc/fail2ban/jail.local
    ```
7. Update config file by doing these changes:
    ```bash
    [ssh]
    enabled   = true
    banaction = ufw-ssh
    port      = 2200
    filter    = sshd
    logpath   = /var/log/auth.log
    maxretry  = 3
    ```
8. Create an ufw-ssh action:
    ```bash
    sudo touch /etc/fail2ban/action.d/ufw-ssh.conf
    sudo nano /etc/fail2ban/action.d/ufw-ssh.conf
    ```
9. Define the action as the following:
    ```bash
    [Definition]
    actionstart =
    actionstop =
    actioncheck =
    actionban = ufw insert 1 deny from <ip> to any app OpenSSH
    actionunban = ufw delete deny from <ip> to any app OpenSSH
    ```
10. Restart ```fail2ban``` service:
    ```bash
    sudo service fail2ban stop
    sudo service fail2ban start
    ```

#### 5. Timezone Configurations:
References:
- [Why is it important that servers have the exact same time?](https://serverfault.com/questions/685626/why-is-it-important-that-servers-have-the-exact-same-time)
- [Changing the time zone on Ubuntu](https://help.ubuntu.com/community/UbuntuTime#Using_the_Command_Line_.28terminal.29).

Steps:
1. Open the timezone selection dialog and choose ```None of the above```, then         ```UTC```.
    ```bash
    sudo dpkg-reconfigure tzdata
    ```
2. Install the ntp daemon ntpd for regular and improving time sync:
    ```bash
    sudo apt-get install ntp
    ```
3. Open [NTP pool project site](http://www.pool.ntp.org/en/) and replace the default servers in the ntp.conf file with the closest ones to you: 
    ```bash
    sudo nano /etc/ntp.conf
    ```
    ```bash
    # Specify one or more NTP servers.

    # Use servers from the NTP Pool Project. Approved by Ubuntu Technical Board
    # on 2011-02-08 (LP: #104525). See http://www.pool.ntp.org/join.html for
    # more information.
    server 0.ubuntu.pool.ntp.org
    server 1.ubuntu.pool.ntp.org
    server 2.ubuntu.pool.ntp.org
    server 3.ubuntu.pool.ntp.org
    ```
#### 6. Packages Installation:
Steps:
1. Install ```apache2``` package:
    ```bash
    sudo apt-get install apache2
    ```
2. Install ```mod_wsgi``` package:
    ```bash
    sudo apt-get install libapache2-mod-wsgi
    ```
3. Install ```postgresql``` package:
    ```bash
    sudo apt-get install postgresql
    ```
4. Install ```git``` package:
    ```bash
    sudo apt-get install git
    ```
5. Install python packages:
    ```bash
    sudo apt-get install python-psycopg2 python-flask
    sudo apt-get install python-sqlalchemy python-pip
    ```
#### 7. PostgreSQL Configurations:
References:
- [Install and Configure PostgreSQL](http://www.thegeekstuff.com/2009/04/linux-postgresql-install-and-configure-from-source/)

Steps:
1. Check if no remote connections are allowed:
    ```bash
    sudo nano /etc/postgresql/9.3/main/pg_hba.conf
    ```
2. Login as user ```postgres```:
    ```bash
    sudo su - postgres
    ```
3. Log in postgreSQL shell:
    ```bash
    psql
    ```
4. Create a new database named restaurantmenu and create a new user named userdb in postgreSQL shell:
    ```bash
    postgres=# CREATE DATABASE restaurantmenu;
    postgres=# CREATE USER userdb;
    ```
5. Set a password for user userdb:
    ```bash
    postgres=# ALTER ROLE userdb WITH PASSWORD 'password';
    ```
6. Give user "userdb" permission to "restaurantmenu" application database:
    ```bash
    postgres=# GRANT ALL PRIVILEGES ON DATABASE restaurantmenu TO userdb;
    ```
7. Quit and exit postgreSQL:
    ```bash
    postgres=# \q
    exit
    ```
#### 8. Application Deployment Configurations:
References:
- [Name-based Virtual Host Support](http://httpd.apache.org/docs/2.2/en/vhosts/name-based.html)
- [OAuth Provider callback uris](https://discussions.udacity.com/t/oauth-provider-callback-uris/20460)
- [How To Deploy a Flask Application on an Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-application-on-an-ubuntu-vps)

Steps:
1. Go to ```www``` directory:
    ```bash
    cd /var/www
    ```
2. Create the application directory:
    ```bash
    sudo mkdir FlaskApp.com
    ```
3. Move inside this directory:
    ```bash
    cd FlaskApp.com
    ```
4. Clone the application to the virtual machine:
    ```bash
    sudo git clone https://github.com/Mohllal/udacity-fsnd.git
    ```
    **Note**: Remove all other projects folders other than ```p5-daily_restaurants```.

5. Rename the project directory name:
    ```bash
    udo mv ./p5-daily_restaurants ./FlaskApp
    ```
6. Move inside this directory:
    ```bash
    cd FlaskApp
    ```
7. Rename ```run.py``` to ```__init__.py```:
    ```bash
    sudo mv run.py __init__.py
    ```
8. Edit ```database_setup.py```, ```__init__.py```, and ```queries.py```:
    ```python
    engine = create_engine('postgresql://userdb:password@localhost/restaurantmenu')
    ```
9. Edit ```google_client_secrets.json``` add this to javascript_origins array:
    ```json
    "http://54.68.163.228",
    "http://ec2-54-68-163-228.us-west-2.compute.amazonaws.com"
    ```
    and this to redirect_uris array:
    ```json
    http://ec2-54-68-163-228.us-west-2.compute.amazonaws.com/login,
    http://ec2-54-68-163-228.us-west-2.compute.amazonaws.com/gconnect,
    http://ec2-54-68-163-228.us-west-2.compute.amazonaws.com/auth/google/callback
    ```
10. Use pip to install dependencies:
    ```bash
    sudo pip install -r requirements.txt
    ```
11. Give ```grader``` user permission to write to uploads folder:
    ```bash
    sudo chmod -R 777 /var/www/FlaskApp.com/FlaskApp/uploads
    ```
12. Create the .wsgi file under ```/var/www/FlaskApp.com```:
    ```bash
    cd /var/www/FlaskApp
    sudo touch flaskapp.wsgi 
    sudo nano flaskapp.wsgi 
    ```
13. Add the following lines of code to it:
    ```
    #!/usr/bin/python
    import sys
    import logging

    sys.path.append('/usr/local/lib/python2.7/dist-packages')
    logging.basicConfig(stream=sys.stderr)
    sys.path.insert(0,"/var/www/FlaskApp.com/")
    sys.path.insert(1,"/var/www/FlaskApp.com/FlaskApp")

    from FlaskApp import app as application
    application.secret_key = 'Add your secret key'
    ```
14. Create the .conf file under ```/etc/apache2/sites-available/```:
    ```bash
    cd  /etc/apache2/sites-available/
    sudo touch FlaskApp.com.conf
    sudo nano FlaskApp.com.conf
    ```
15. Add the following lines of code to it:
    ```
    <VirtualHost *:80>
        ServerName FlaskApp.com
        ServerAlias www.FlaskApp.com
        ServerAdmin admin@FlaskApp.com
        DocumentRoot /var/www/FlaskApp.com
        WSGIScriptAlias / /var/www/FlaskApp.com/flaskapp.wsgi
        <Directory /var/www/FlaskApp.com/FlaskApp/>
                Require all granted
        </Directory>
        Alias /static /var/www/FlaskApp.com/FlaskApp/static
        <Directory /var/www/FlaskApp.com/FlaskApp/static/>
                Require all granted
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        LogLevel warn
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>
    ```
16. Disable ```000-default``` and enable the new virtual host:
    ```bash
    sudo a2dissite 000-default.conf
    sudo a2ensite FlaskApp.com.conf
    ```
17. Restart apache:
    ```bash
    sudo service apache2 restart
    ```