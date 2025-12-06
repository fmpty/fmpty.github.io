---
title: "openwrt  git 与 sourcetree 冲突解决方法"
date: "2022-05-07T12:25:00+08:00"
draft: False
slug: "openwrt-git-与-sourcetree-冲突解决方法"
typecho_id: "831"
---
C:/Users/用户名/.ssh 新建 config  输入下面内容

    Host *
    KexAlgorithms +diffie-hellman-group1-sha1
    HostkeyAlgorithms +ssh-rsa
    PubkeyAcceptedKeyTypes +ssh-rsa
![微信截图_20220507122701.png](微信截图_20220507122701.png)