---
title: "docker 创建容器 启动 ssh  映射 端口 设置名字"
date: "2020-09-29T11:17:00+08:00"
draft: False
slug: "docker-创建容器-启动-ssh-映射-端口-设置名字"
typecho_id: "590"
---
docker run -d -p 5222:22 -p 5280:80 -p 8554:8554 -p 8555:8555 -p 8556:8556 -p 8557:8557 -p 8558:8558 -p 8559:8559 --name test1 -v G:\\docker:/home/tom my_ubuntu_18 /usr/sbin/sshd -D

提交容器为镜像docker commit 8ba6903ab069 my_ubuntu_18
导出镜像 docker save -o my_ubuntu_18.tar my_ubuntu_18
导出容器 docker export -o 8ba6903ab069.tar 8ba6903ab069