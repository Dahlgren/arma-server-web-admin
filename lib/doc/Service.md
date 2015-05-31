### Install Init Script

Tested on Ubuntu 15.04 with installed `nodejs-legacy` package to provide `/usr/bin/node`

Copy the init script

    sudo cp lib/support/arma-server-web-admin.service /etc/systemd/system/arma-server-web-admin.service

Edit the service file with the correct paths and user/group using your favorite texteditor e.g.

	vim /etc/systemd/system/arma-server-web-admin.service

Enable the service to autorun at boot.

    systemctl enable arma-server-web-admin

Now start the service:

    systemctl start arma-server-web-admin

Your now able to use the normal service command aswell

	service arma-server-web-admin start
	service arma-server-web-admin status
	service arma-server-web-admin stop
