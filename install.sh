
if ! service --status-all | grep -Fq "pm2"; then
   sudo npm install -g pm2
fi

npm install
pm2 startup systemd -u pi
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
pm2 start index.js --name smart-gateway -e err.log -o out.log
pm2 save
