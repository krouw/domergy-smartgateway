Raspberry Zigbee API


node_modules/serialport -> node-gyp configure build


DOCKER

docker build -t "dye/meter:1.1" .

docker run --name=meter --privileged CONTAINER

PM2

Restart PM2 services
 su user -c "pm2 dump && pm2 kill" && su root -c "systemctl daemon-reload && systemctl enable pm2 && systemctl start pm2"

Run PM2 Startup

1. run sudo rm /etc/init.d/pm2-init.sh
2. run pm2 startup systemd -u pi
3. run sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
4. pm2 start index.js --name smart-gateway -e err.log -o out.log
5. pm2 save
6. reboot (if ubuntu)
