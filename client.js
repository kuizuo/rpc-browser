import WebSocket from 'ws';

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
          ws.close()
          resolve(value);
          break;
      }
    });
  });
}

async function run() {
  let passwordEnc = await getPasswordEnc('a123456');
  console.log(passwordEnc);
}

run();
