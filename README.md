Raspberry Zigbee API


node_modules/serialport -> node-gyp configure build


DOCKER

docker build -t "dye/meter:1.1" .

docker run --name=meter --privileged CONTAINER

PM2

1. sudo su
2. as root, rm /etc/init.d/pm2-init.sh
3. as root, run pm2 startup. it still complains that /etc/init.d/pm2-init.sh links already exists, despite just removing it
4. as root, pm2 start (my processes, eg ecosystem.json), pm2 start ecosystem.json
5. as root, pm2 save
6. reboot (if ubuntu)
