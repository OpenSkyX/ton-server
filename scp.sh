zip dist.zip dist
scp ./dist.zip root@16.163.205.151:/home/ton-pump-server/dist_$(date +%s).zip
# e^3Rrxi&
unzip dist.zip
rm dist.zip
cd dist && yarn install && yarn buildMac && 
pm2 delete ton-pump-server && pm2 start ./start.sh --name ton-pump-server