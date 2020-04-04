---
layout: post
title:  ssh免密登录及scp、rsync文件传输
date: 2020-01-02
tags: 博客
---
## ssh免密登录

Hadoop控制脚本(并非守护进程)依赖SSH来执行针对整个集群的操作。为了支持无缝式工作，安装配置好ssh之后，可以是集群内机器的hdfs用户和yarn用户免密码登录。实现的最简单的方法是创建一个公钥/私钥对，存放到NFS中，让整个集群共享该密钥对。如果home目录并没有通过NFS共享，则需要利用ssh-copy-id等方法共享公钥。
注意：免密登录也不是万能的。免密登录时值从一台主机A的用户userA,使用userB用户（B主机的一个用户）登录到主机B。存在着严格的对应关系：比如只能用bigdata1的root使用bigdata2的root用户登录到主机bigdata2:root@bigdata1 ====>root@bigdata2。

#### 实现步骤：

1、在客户端生成一对密钥（公钥/私钥） ,基于空口令生成一个新的ssh密钥，以实现无密码登录：

    $ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa

参数说明：

-t 加密算法类型，这里是使用rsa算法

-P 指定私钥的密码，不需要可以不指定

-f 指定生成秘钥对保持的位置

2、将客户端公钥发送给服务端（其他客户端），使用ssh-copy-id

    $ ssh-copy-id -i ~/.ssh/id_rsa.pub root@bigdata2

    注：经过ssh-copy-id后接收公钥的服务端会把公钥追加到服务端对应用户的$HOME/.ssh/authorized_keys文件中.

3、客户端请求（带有自己的用户名和主机名）

4、服务端根据客户端的用户名和主机名查找对应的公钥，将一个随机的字符串用该公钥加密后发送给客户端

5、客户端用自己的私钥进行解密收到的字符串，并将解密后的字符串发送给服务端

6、服务端对比发送出去的和接收到的字符串是否相同，返回登录结果
测试：登录成功

## 远程拷贝命令 scp

scp工具，基于ssh远程安全登录的，可以将主机A上的文件或目录拷贝给主机B并且改名字，也可以将主机B上的文件或目录下载到主机A中，同时也支持修改文件名。

1、远程拷贝文件

    $ scp 本机文件 user@host:路径/

    将bigdata1上的/etc/profile文件拷贝到bigdata2的根目录下
    $ scp /etc/profile root@bigdata2:/
    将bigdata1上的/etc/profile文件拷贝到bigdata2的根目录下,并改名为profile.txt
    $ scp /etc/profile root@bigdata2:/profile.txt

2、远程拷贝目录

    $ scp -r 本机目录 user@host:路径/

    将bigdata1上的/bin目录拷贝到bigdata2的根目录下
    $ scp -r /bin root@bigdata2:/home/ （-r 表示递归）

3、下载文件到本地

    $ scp user@host:文件名 本地目录

    将bigdata2上的/profile下载到本地并改名为profile.txt
    $ scp root@bigdata2:/profile ./profile.txt

4、下载目录到本地

    $ scp -r user@host:文件名 本地目录

    将bigdata2上的/bin下载到本地并改名为bin.bak
    $ scp -r root@bigdata2:/home/bin ./bin.bak

## 远程拷贝命令 rsync

    $ rsync -av /home/test.txt root@bigdata2:/home/

其中，`-a`是归档拷贝，`-v`显示复制过程。此命令将本地命令传输给其他主机。

`rsync`命令要比`scp`更好，只会拷贝差异的部分。

#### 分发文件给所有主机（最好先实现免密登录）

    #!/bin/bash
    #1 获取输入参数个数，如果没有参数，直接退出
    pcount=$#
    if ((pcount==0)); then
    echo no args;
    exit;
    fi

    #2 获取文件名称
    p1=$1
    fname=`basename #p1`
    echo fname=$fname

    #3 获取上级目录到绝对路径,`-P`是为了追踪软连接
    pdir=`cd -P $(dirname $p1); pwd`
    echo pdir=$pdir

    #4 获取当前用户
    user=`whoami`

    #5 循环
    for((host=103; host<105; host++)); do
        echo ------------ hadoop$host -------------
        rsync -av $pdir/$fname $user@hadoop$host:$pdir
    done
