---
title: "window to linux下最好用的 rsync 方式"
date: "2022-05-25T15:33:00+08:00"
draft: False
slug: "window-to-linux下最好用的-rsync-方式"
typecho_id: "837"
---
![微信截图_20220525153239.png](微信截图_20220525153239.png)
解压**[usr.zip][2]**到git 安装目录 D:\\\\Program Files\\\\Git\\\\usr
然后跟linux 下面一样 创建.sh文件 填入 命令rsync -rtv --exclude-from=exclude.list --progress  src  dst
双击就可以进行同步
![微信截图_20220525153440.png](微信截图_20220525153440.png)

  
  [2]: http://typeecho.trtos.com/blog/typecho/usr.zip