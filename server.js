import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

let ws = new WebSocketServer({ port: 8080 });

let browserWebsocket = null;
let clients = [];

ws.on('connection', (socket) => {
  let client_id = uuidv4();
  clients.push({
    id: client_id,
    socket: socket,
  });

  socket.on('close', () => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id == client_id) {
        clients.splice(i, 1);
        break;
      }
    }
  });

  socket.on('message', (message) => {
    try {
      let json = JSON.parse(message);
      let { id, type, value } = json;
      switch (type) {
        case 'isBrowser':
          if (value) {
            browserWebsocket = socket;
          }
          console.log('浏览器已初始化');
          break;

        // 发送给浏览器 让浏览器来调用并返回
        case 'callbackPasswordEnc':
          // 根据id找到调用的用户,并向该用户发送加密后的密文
          let temp_socket = clients.find((c) => c.id == id).socket;

          temp_socket.send(message);
          break;
        // 用户发送过来要加密的明文
        case 'getPasswordEnc':
          let jsonStr = JSON.stringify({
            id: client_id,
            type: type,
            value: value,
          });

          // 这里一定要是浏览器的websocket句柄发送
          browserWebsocket.send(jsonStr);
          break;
      }
    } catch (error) {
      console.log(error.message);
    }
  });
});
