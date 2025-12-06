---
title: "修改 ubuntu  允许局域网 root  默认登录"
date: "2020-09-29T11:02:50+08:00"
draft: False
slug: "修改-ubuntu-允许局域网-root-默认登录"
typecho_id: "588"
---
vi /etc/ssh/sshd_config
修改 PermitRootLogin yes
保存后  /etc/init.d/ssh restart
![微信截图_20200929111641.png](微信截图_20200929111641.png)
容器 会关闭 ，再启动容器登陆 即可