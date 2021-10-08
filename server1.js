import WebSocket, { WebSocketServer } from 'ws';

let ws = new WebSocketServer({ port: 8080 });

ws.on('connection', (socket) => {
  console.log('有人连接了');
  function message(data) {
    try {
      let json = JSON.parse(data); // data: {"type":"callbackPasswordEnc","value":"a123456"}
      let { type, value } = json;
      switch (type) {
        case 'callbackPasswordEnc':
          // doSomething()
          console.log('得到的加密密文为:' + value);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  socket.on('message', message);

  // 浏览器通信1秒后向浏览器调用加密算法
  setTimeout(() => {
    let jsonStr = JSON.stringify({
      type: 'getPasswordEnc',
      value: 'a123456',
    });
    socket.send(jsonStr);
  }, 1000);
});
