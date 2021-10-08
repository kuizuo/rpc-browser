RPC 远程调用浏览器函数

原文介绍地址: [RPC远程调用浏览器函数](https://kuizuo.cn/RPC%E8%B0%83%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8)

## 安装

```
npm i
```

## 测试

运行`server_http.js`或输入命令开启websocket服务与http服务

```
node "f:\Node\npmStudy\ws\server_http.js"
```

浏览器打开百度首页，点击登录找到所要调用的函数`e.RSA.encrypt(s)`位置，注入`browser.js`的代码，并登录触发注入的代码，关于如何注入代码可查看视频 [志远 2021 全新 js 逆向 RPC](https://www.bilibili.com/video/BV1Kh411r7uR?p=36) 相对比较详细。

这时候会看到控制台输出`浏览器已初始化`，说明浏览器与websocket服务端已完成通信。此时切记不要关闭浏览器，这时候发送GET请求 url http://127.0.0.1:8000/getPasswordEnc?password=a123456 便可返回调用 `e.RSA.encrypt`后的结果。

或运行`client.js` 进行websocket调用，当然还是推荐http调用来的方便快捷。

## 后续完善

本代码只是初步实现如何远程调用浏览器的函数，还尚未使用在项目中。后续可能会封装成Express框架，便于代码的编写与完善。