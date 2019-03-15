npm install
pm2 start index.js --name smart-gateway -e err.log -o out.log
pm2 save
