---
id: n_34b6700480346e4d
title: oauth2改代理登录需求
updated: "2026-04-10T06:57:07Z"
date: "2026-04-10"
public: true
draft: false
---

## 迁移说明：从直接 OAuth 登录改为代理登录
### 背景
原项目直接在前端/客户端处理 GitHub/Gitee OAuth 登录，需要：

1. 在前端配置 Client ID 和 Client Secret（不安全）
2. 每个环境都要在 OAuth 应用后台配置不同的回调地址
3. 前端直接处理授权码换取 Token 的流程
### 新方案：使用代理登录服务
已部署代理登录服务 http://47.107.74.235:9011 ，统一处理 GitHub/Gitee OAuth 流程。

### 需要修改的内容 1. 移除前端的 OAuth 配置
删除：

- 前端代码中的 client_id 和 client_secret
- 前端直接调用 GitHub/Gitee Token 接口的代码 2. 修改登录跳转逻辑
原代码（直接跳转 GitHub）：

```
// 原方式：直接跳转到 GitHub
window.location.href = `https://
github.com/login/oauth/authorize?
client_id=${CLIENT_ID}&
redirect_uri=${CALLBACK_URL}`;
```
新代码（通过代理服务）：

```
// 新方式：通过代理服务跳转
const redirectUrl = 
encodeURIComponent('http://your-app.
com/auth/callback');
window.location.href = `http://47.
107.74.235:9011/login/github?
redirect=${redirectUrl}`;
``` 3. 修改回调处理逻辑
原代码（前端处理回调）：

```
// 原方式：前端用 code 换取 token
const response = await fetch
('https://github.com/login/oauth/
access_token', {
  method: 'POST',
  body: { client_id, client_secret, 
  code }
});
```
新代码（代理服务已处理）：

```
// 新方式：代理服务已完成登录，直接获取结
果
// 访问回调地址后会自动返回 JSON 数据：
{
  "success": true,
  "provider": "github",
  "access_token": "gho_xxxxxx",
  "user": {
    "id": "16174596",
    "username": "tongjinlv",
    "email": "xxx@qq.com",
    "name": "童惊宇",
    "avatar": "https://avatars.
    githubusercontent.com/..."
  },
  "redirect_url": "http://your-app.
  com/auth/callback"
}
``` 4. 统一回调地址配置
- 在代理服务的 config.yaml 中已配置统一的回调地址
- 在 GitHub/Gitee OAuth 应用后台只需配置一个回调地址： http://47.107.74.235:9011/callback/github 或 /callback/gitee
- 你的应用通过 redirect 参数指定实际跳转回来的地址
### 优势
1. 更安全 ：Client Secret 不再暴露在前端
2. 更简单 ：无需为每个环境配置不同的 OAuth 应用
3. 统一 ：多环境（dev/staging/prod）使用同一个代理服务
### API 端点
- 登录 ： GET http://47.107.74.235:9011/login/:provider?redirect=你的回调地址
  - :provider 可以是 github 或 gitee
- 代理登录 （已有 code 时）： POST http://47.107.74.235:9011/proxy/login
  - Body: { "provider": "github", "code": "授权码" }
