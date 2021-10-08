import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';

async function getPasswordEnc(password) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://127.0.0.1:8080');

    ws.on('open', () => {
      let jsonStr = JSON.stringify({
        type: 'getPasswordEnc',
        value: password,
      });
      ws.send(jsonStr);
    });

    ws.on('message', (message) => {
      let json = JSON.parse(message);
      let { type, value } = json;
      switch (type) {
        case 'callbackPasswordEnc':
          ws.close();
          resolve(value);
          break;
      }
    });
  });
}

const app = http.createServer(async (request, response) => {
  let { pathname, query } = url.parse(request.url, true);

  if (pathname == '/getPasswordEnc') {
    let passwordEnc = await getPasswordEnc(query.password);
    response.end(passwordEnc);
  }
});

app.listen(8000, () => {
  console.log(`服务已运行 http://127.0.0.1:8000/`);
});

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
            console.log('浏览器已初始化');
          }
          break;

        // 发送给浏览器 让浏览器来调用并返回
        case 'callbackPasswordEnc':
          // 根据id找到调用的用户,并向该用户发送加密后的密文
          let temp_socket = clients.find((c) => c.id == id).socket;
          console.log(message.toString());
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
