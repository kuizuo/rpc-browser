!(function () {
  let url = 'ws://127.0.0.1:8080';
  let ws = new WebSocket(url);

  // 浏览器连接后告诉服务端是浏览器
  ws.onopen = function (event) {
    ws.send(JSON.stringify({ type: 'isBrowser', value: true }));
  };

  ws.onmessage = function (event) {
    let json = JSON.parse(event.data);
    let { id, type, value } = json;
    switch (type) {
      case 'getPasswordEnc':
        let passwordEnc = e.RSA.encrypt(value);
        let jsonStr = JSON.stringify({
          id,
          type: 'callbackPasswordEnc',
          value: passwordEnc,
        });
        console.log(jsonStr);
        ws.send(jsonStr);
        break;
    }
  };
})();
