import { Logger } from '@nestjs/common';
import { hostname } from 'os';
import WebSocket, { WebSocketServer } from 'ws';


const wss = new WebSocketServer({
  port: 4050,
  // host: "localhost",
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

export function startWssServer() {

  const logger = new Logger('WssServer');
  // WebSocket 连接建立时的处理
  wss.on('connection', function connection(ws) {
    logger.log('Client connected');

    // 监听客户端发送的消息
    ws.on('message', function incoming(message) {
      logger.log('Received: %s', message);

      // 广播收到的消息给所有连接的客户端
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    // 连接关闭时的处理
    ws.on('close', function () {
      logger.log('Client disconnected');
    });
  });
  logger.log(`WebSocket server started at ws://` + wss.options.host + `:` + wss.options.port);
}
// 在 server.js 中添加的公共广播方法

export function broadcastMessage(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

