import WebSocket from 'ws';

const ws = new WebSocket('ws://16.163.205.151:4050');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});