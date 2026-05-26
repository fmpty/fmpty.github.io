---
id: n_ae1e74a5db92ac2c
title: macbook 做服务器
updated: "2026-05-07T09:27:15Z"
date: "2026-05-07"
public: false
draft: true
---

进入系统设置 链接适配器时不休眠
open /Applications/Docker.app
等待片刻 启动后
sudo docker start 1330a1f4761a
1330a1f4761a        ubuntu_03:ssh       "/usr/sbin/sshd -D"   8 years ago         Up 7 minutes        0.0.0.0:50001->22/tcp   work
ssh root@127.0.0.1 -p 50001
