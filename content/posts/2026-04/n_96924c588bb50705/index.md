---
id: n_96924c588bb50705
title: 轻量级笔记工具 · Notempty
updated: "2026-04-15T08:35:42Z"
date: "2026-04-15"
public: true
draft: false
---

# 轻量级笔记工具 · Notempty


一个对新手友好的本地网页笔记工具：

- 浏览器里写 Markdown，自动保存
- 粘贴或拖拽上传图片，和笔记放一起
- 支持公开页展示勾选为「公开」的笔记
- 支持 **代理登录** / GitHub / Gitee OAuth 登录（多用户隔离）

适合个人知识库、小团队内网笔记、或者把数据同步到 Git 仓库做版本管理。

---

## 目录

-1 分[钟理解它怎么工作](https://)
- [你将获得什么功能](#你将获得什么功能)
- [运行前准备](#运行前准备)
- [登录方式选择](#登录方式选择)
- [快速启动](#快速启动)
- [配置文件说明](#配置文件说明)
- [代理登录配置（推荐）](#代理登录配置推荐)
- [OAuth 登录配置](#oauth-登录配置)
- [构建与服务部署](#构建与服务部署)
- [API 摘要](#api-摘要)
- [安全建议](#安全建议)
- [技术栈](#技术栈)
- [许可证](#许可证)

---

## 1 分钟理解它怎么工作

- 程序启动后提供一个本地网页（比如 `http://127.0.0.1:8787`）
- 你在网页里编辑笔记，内容写到本机磁盘
- 每位登录用户都有自己的目录：`users/<provider>/<login>/...`
- 每篇笔记是一个文件夹，默认目录结构是 `YYYY-MM/<noteId>/index.md`（与 Hugo leaf bundle 一致；旧数据可为 `note.md`）

示例（以 GitHub 用户 `alice` 为例）：

```text
notes-vault/
├── users/
│   └── github/
│       └── alice/
│           └── 2026-03/
│               └── n_xxxxxxxx/
│                   ├── index.md
│                   └── image-*.png
└── .notes-sidebar-order.json
```

---

## 你将获得什么功能

- **Markdown 编辑 + 实时预览**（基于 EasyMDE）
- **侧栏搜索**（标题/正文全文检索）
- **拖拽排序**（顺序保存在 `.notes-sidebar-order.json`）
- **图片粘贴/拖拽上传**（支持 PNG/JPG/GIF/WebP/HEIC/AVIF/BMP）
- **明暗主题切换**（自动保存偏好）
- **公开笔记列表与详情页**（可生成静态分享链接）
- **多用户隔离**（不同登录用户数据完全分离）
- **Windows / Linux 服务安装**（可选，支持开机自启）

### 笔记 front matter（Hugo 风格）

- 支持常见字段：`title`、`date`、`draft`、`tags`、`categories`（标签与分类会被忽略、不入库；**从网页保存**会按本站格式重写 front matter，若需长期保留完整 Hugo 头请用 Git 或外部编辑器）。
- **`draft` 与「是否公开」**：`draft: false` 等价于勾选公开（与 `public: true` 一致）；`draft: true` 表示不公开。
- 若同时写了 `public` 和 `draft`，以 **`public` 为准**（方便你手动覆盖）。

---

## 运行前准备

### 必需

- Go 1.21+（仅从源码运行/构建时需要）

### 登录方式（三选一）

1. **代理登录（推荐）** - 使用统一的代理服务处理 OAuth，配置最简单
2. **GitHub OAuth** - 直接使用 GitHub 账号登录
3. **Gitee OAuth** - 直接使用 Gitee 账号登录

> 不配置登录也能启动程序，但前端会提示你先配置登录，无法正常使用笔记功能。

---

## 登录方式选择

### 方式一：代理登录（推荐）

**适用场景**：
- 不想自己申请 OAuth 应用
- 多环境部署（开发/测试/生产使用同一套配置）
- 简化配置，避免管理多个平台的 Client ID/Secret

**优点**：
- 配置最简单，只需一个代理服务地址
- 无需申请 GitHub/Gitee OAuth 应用
- 统一的回调地址，多环境部署更方便
- 客户端不接触 Client Secret，更安全

### 方式二：直接 OAuth 登录

**适用场景**：
- 完全自主控制登录流程
- 不信任第三方代理服务
- 需要自定义 OAuth 权限范围

---

## 快速启动

### 方式一：使用代理登录（最简单）

```bash
git clone https://github.com/你的ID/你的仓库.git
cd 你的仓库

# 编辑配置文件，填入代理服务地址
echo '{
  "listen": "127.0.0.1:8787",
  "proxyAuth": {
    "proxyUrl": "http://你的代理服务器:端口",
    "cookieSecret": "请替换成32位以上随机字符串"
  }
}' > notes-config.json

go run .
```

### 方式二：从源码运行

```bash
git clone https://github.com/你的ID/你的仓库.git
cd 你的仓库
go run .
```

默认读取当前目录下 `notes-config.json`。  
启动后看控制台日志里的地址，浏览器打开即可。

---

## 配置文件说明

配置文件为 `notes-config.json`，程序启动时会自动读取。

### 配置示例

#### 代理登录配置（推荐）

```json
{
  "listen": "127.0.0.1:8787",
  "data": "notes-vault",
  "maxUploadMB": 100,
  "proxyAuth": {
    "proxyUrl": "http://47.107.74.235:9011",
    "cookieSecret": "请替换成32位以上随机字符串",
    "allowedLogins": []
  }
}
```

#### 直接 OAuth 配置

```json
{
  "listen": ":8787",
  "data": "notes-vault",
  "maxUploadMB": 100,
  "githubOAuth": {
    "clientId": "xxx",
    "clientSecret": "xxx",
    "callbackUrl": "http://127.0.0.1:8787/auth/github/callback",
    "cookieSecret": "请替换成32位以上随机字符串",
    "allowedLogins": []
  },
  "giteeOAuth": {
    "clientId": "xxx",
    "clientSecret": "xxx",
    "callbackUrl": "http://127.0.0.1:8787/auth/gitee/callback",
    "cookieSecret": "请替换成32位以上随机字符串",
    "allowedLogins": []
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `listen` | string | 是 | 监听地址。`:8787` 表示本机/局域网都可访问；`127.0.0.1:8787` 表示仅本机访问（更安全） |
| `data` | string | 否 | 数据目录，推荐写相对路径如 `notes-vault`，也可写绝对路径 |
| `maxUploadMB` | int | 否 | 单文件上传上限（MB），默认 10MB，最大 512MB |
| `proxyAuth` | object | 否 | 代理登录配置（推荐） |
| `proxyAuth.proxyUrl` | string | 是 | 代理服务地址，如 `http://47.107.74.235:9011` |
| `proxyAuth.cookieSecret` | string | 是 | 用于签名会话，建议 32+ 长随机串 |
| `proxyAuth.allowedLogins` | array | 否 | 允许登录的用户白名单，空数组表示不限制 |
| `githubOAuth` | object | 否 | GitHub OAuth 配置 |
| `giteeOAuth` | object | 否 | Gitee OAuth 配置 |

### 环境变量

以下环境变量可覆盖配置文件中的对应值：

| 环境变量 | 说明 |
|----------|------|
| `NOTES_AUTH_COOKIE_SECRET` | 覆盖 `cookieSecret` |

---

## 代理登录配置（推荐）

代理登录使用外部代理服务统一处理 OAuth 流程，是最简单的配置方式。

### 工作原理

```
┌─────────────┐     点击登录      ┌──────────────┐     OAuth 授权     ┌─────────────┐
│   浏览器    │ ────────────────→ │  代理服务    │ ────────────────→ │ GitHub/Gitee│
│             │                   │ (47.107.74.  │                   │             │
│             │ ←──────────────── │  235:9011)   │ ←───────────────  │             │
│             │   携带用户信息    │              │   返回授权信息    │             │
└─────────────┘                   └──────────────┘                   └─────────────┘
       ↑
       │ 代理服务将用户信息通过回调地址传回
       │ （包含 access_token, user_id, username, avatar 等）
       ↓
┌─────────────┐
│  笔记应用   │  创建会话，设置 Cookie，完成登录
└─────────────┘
```

### 配置步骤

1. **获取代理服务地址**
   - 可以使用公共代理服务
   - 或自行搭建代理服务

2. **编辑配置文件**

```json
{
  "listen": "127.0.0.1:8787",
  "proxyAuth": {
    "proxyUrl": "http://47.107.74.235:9011",
    "cookieSecret": "Zq8kP2vN9xR4mL7wY1cH5jF3bT0sA6eU8iO2qW4gM9nB3vK7",
    "allowedLogins": []
  }
}
```

3. **生成 cookieSecret**
   - 建议 32 位以上随机字符串
   - 可使用命令生成：`openssl rand -base64 32`

4. **启动程序**

```bash
go run .
```

5. **验证登录**
   - 打开 `http://127.0.0.1:8787`
   - 点击 GitHub 或 Gitee 登录按钮
   - 授权完成后自动回到笔记页

### 限制用户登录（可选）

如需限制只有特定用户可以登录：

```json
{
  "proxyAuth": {
    "proxyUrl": "http://47.107.74.235:9011",
    "cookieSecret": "你的随机字符串",
    "allowedLogins": ["alice", "bob"]
  }
}
```

只有 `alice` 和 `bob` 可以登录，其他用户会被拒绝。

---

## OAuth 登录配置

如果你选择不使用代理登录，可以直接配置 GitHub 或 Gitee OAuth。

### A. GitHub 登录配置

1. 打开 GitHub → Settings → Developer settings → OAuth Apps → New OAuth App  
2. 填写：
   - Application name：随意（如 `Local Notes`）
   - Homepage URL：`http://127.0.0.1:8787`
   - Authorization callback URL：`http://127.0.0.1:8787/auth/github/callback`
3. 创建后拿到：
   - `Client ID`
   - `Client Secret`
4. 填到 `notes-config.json` 的 `githubOAuth`。

### B. Gitee 登录配置

1. 打开 Gitee 开放平台，创建第三方应用  
2. 回调地址填：`http://127.0.0.1:8787/auth/gitee/callback`
3. 获取 `clientId` / `clientSecret`
4. 填到 `notes-config.json` 的 `giteeOAuth`。

### C. 启动与验证

1. 保存配置后重启程序
2. 打开首页
3. 点击 GitHub 或 Gitee 登录按钮
4. 授权完成后自动回到笔记页

### 常见报错排查

- **"回调地址不匹配"**
  - 检查平台配置与 `callbackUrl` 是否逐字一致（协议、域名、端口、路径都要一致）
- **"服务未配置 OAuth"**
  - `clientId/clientSecret/callbackUrl/cookieSecret` 是否有空值
- **登录后仍未进入**
  - 看控制台日志是否有 OAuth 配置无效提示
  - 检查浏览器是否拦截了第三方跳转/弹窗

---

## 构建与服务部署

### 从源码构建

```bash
go build -o notes .
```

Windows 可用：

- `build.bat build`：编译 `notes.exe`
- `build.bat run`：直接运行

### 命令行参数

| 参数 | 说明 |
| ---- | ---- |
| `-config` | 配置文件路径；默认 `<可执行文件目录>/notes-config.json`（`go run` 时为当前目录） |
| `-service` | `install` / `uninstall` / `start` / `stop` / `restart` |
| `-svc-name` | 服务名，默认 `LocalNotes` |

### 作为系统服务运行

#### Windows

```powershell
# 安装服务
.\notes.exe -service install

# 启动服务
.\notes.exe -service start

# 停止服务
.\notes.exe -service stop

# 卸载服务
.\notes.exe -service uninstall
```

#### Linux (systemd)

```bash
# 创建服务文件
sudo tee /etc/systemd/system/localnotes.service > /dev/null <<EOF
[Unit]
Description=Local Notes Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/path/to/notes
ExecStart=/path/to/notes/notes
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable localnotes
sudo systemctl start localnotes

# 查看状态
sudo systemctl status localnotes
```

---

## API 摘要

### 认证相关

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET | `/api/auth/status` | 获取认证状态（是否配置登录、当前用户等） |
| POST | `/api/logout` | 退出登录 |

### 笔记管理

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET | `/api/notes` | 获取笔记列表 |
| POST | `/api/notes` | 新建笔记 |
| PUT | `/api/notes/:id` | 更新笔记 |
| DELETE | `/api/notes/:id` | 删除笔记 |
| POST | `/api/media` | 上传图片 |
| GET | `/api/vault/*` | 读取笔记附件 |

### 公开访问

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET | `/api/public/posts` | 公开笔记列表 |
| GET | `/api/public/post?id=xxx` | 公开笔记详情 |
| GET | `/public` | 公开笔记页面 |

---

## 安全建议

- **监听地址**：能用 `127.0.0.1` 就不要监听 `0.0.0.0`，避免暴露到公网
- **反向代理**：若部署在服务器，建议加一层 Nginx/Caddy 反向代理，并配置 HTTPS
- **访问控制**：配合防火墙或 VPN 限制访问来源
- **密钥管理**：`clientSecret` 和 `cookieSecret` 不要提交到 Git，可通过环境变量注入
- **白名单**：生产环境建议使用 `allowedLogins` 限制可登录用户
- **代理服务**：使用可信的代理服务，或自行搭建

### 生产环境建议配置

```json
{
  "listen": "127.0.0.1:8787",
  "data": "/var/lib/notes/data",
  "maxUploadMB": 50,
  "proxyAuth": {
    "proxyUrl": "https://你的代理域名",
    "cookieSecret": "${NOTES_AUTH_COOKIE_SECRET}",
    "allowedLogins": ["admin", "user1", "user2"]
  }
}
```

配合 Nginx 反向代理：

```nginx
server {
    listen 443 ssl http2;
    server_name notes.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 技术栈

- **后端**：Go + Gin 框架
- **前端**：纯 HTML/CSS/JS（无框架依赖）
- **Markdown 编辑器**：EasyMDE（基于 CodeMirror）
- **前端资源**：Embed 打包到二进制
- **数据存储**：本地文件系统（Markdown + 图片）
- **元数据**：YAML front matter（Hugo 兼容）

---

## 目录结构

```
.
├── main.go              # 程序入口
├── config.go            # 配置定义
├── proxy_auth.go        # 代理登录实现
├── github_auth.go       # GitHub OAuth 实现
├── gitee_auth.go        # Gitee OAuth 实现
├── auth_bundle.go       # 认证路由管理
├── vault.go             # 笔记存储逻辑
├── user_vault.go        # 用户数据管理
├── public_feed.go       # 公开笔记功能
├── note_markdown.go     # Markdown 处理
├── web/                 # 前端资源
│   ├── index.html       # 主页面
│   ├── app.js           # 前端逻辑
│   ├── style.css        # 样式
│   └── ...
├── notes-config.json    # 配置文件（示例）
├── README.md            # 本文档
├── LICENSE              # MIT 许可证
└── build.bat            # Windows 构建脚本
```

---

## 许可证

MIT License

---

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/你的ID/notes.git
cd notes

# 2. 创建分支
git checkout -b feature/your-feature

# 3. 开发并测试
go run .

# 4. 提交更改
git add .
git commit -m "feat: 添加新功能"

# 5. 推送并创建 PR
git push origin feature/your-feature
```

---

## 常见问题

### Q: 如何备份数据？

数据全部存储在配置的 `data` 目录中，直接备份该目录即可。建议配合 Git 进行版本管理。

### Q: 如何迁移数据到另一台机器？

1. 复制 `data` 目录到新机器
2. 复制 `notes-config.json` 并修改监听地址
3. 启动程序

### Q: 支持多用户同时编辑吗？

不支持实时协作编辑。多用户场景下，每个用户有独立的数据空间，互不影响。

### Q: 图片上传大小限制？

默认 10MB，可通过 `maxUploadMB` 配置调整，最大 512MB。

### Q: 支持移动端吗？

支持响应式设计，可在手机浏览器中使用，但编辑体验不如桌面端。

---

**Enjoy writing! 📝**
