# Raspberry Smart Gateway Xbee/MQTT

### Run as a service with PM2!

Just run `$ ./install.sh`

have problems? Try manual configuration:

`
1. $ npm install && node-gyp configure build
2. $ pm2 startup systemd -u pi
3. $ sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
4. $ pm2 start index.js --name smart-gateway -e err.log -o out.log
5. $ pm2 save
6. reboot (if you are in raspberry pi)`

> If you have problems with pm2 in raspberry pi, run this for restart pm2 services

> $ su user -c "pm2 dump && pm2 kill" && su root -c "systemctl daemon-reload && systemctl enable pm2 && systemclt start pm2"

### Docker

Comming soon!
