npm install && node-gyp configure build
pm2 startup systemd -u pi
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
pm2 start index.js --name smart-gateway -e err.log -o out.log
pm2 save