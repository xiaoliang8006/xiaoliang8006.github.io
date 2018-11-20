---
layout: post
title: CentOS7安装tomcat
date: 2018-10-15 
tags: 博客 
---

# CentOS7安装tomcat

## 环境

#### CentOS7+jdk6以上+tomcat7

##### 需要提前安装好jdk
 
# 目录


* [下载安装tomcat](#n1)
* [(可选)修改端口](#n2)
* [启动tomcat](#n3)
* [放行端口](#n4)
* [设置开机启动](#n5)



## <a name="n1"></a>下载安装tomca

这里我们将apache-tomcat-7.0.29.tar.gz文件上传到/usr/local中

	cd /usr/local
	wget http://apache.fayea.com/apache-mirror/tomcat/tomcat-7/v7.0.57/bin/apache-tomcat-7.0.57.tar.gz
	tar -zxv -f apache-tomcat-7.0.29.tar.gz // 解压压缩包
	rm -rf apache-tomcat-7.0.29.tar.gz // 删除压缩包
	mv apache-tomcat-7.0.29 tomcat7

## <a name="n1"></a>(可选)修改端口

server.xml可以配置端口，编码以及配置项目等等，我们这里就配置一个端口，把默认的8080，修改成80

	vim /usr/local/tomcat7/conf/server.xml
	找到port 8080把其改为80

## <a name="n1"></a>启动tomcat
	/usr/local/tomcat7/bin/startup.sh //启动tomcat
	停止时用：
 	/usr/local/tomcat7/bin/shutdown.sh //停止tomcat

## <a name="n1"></a>放行端口
	vim /etc/sysconfig/iptables
	#增加以下代码
	-A RH-Firewall-1-INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
	重启防火墙
	service iptables restart
***
	或者直接执行
	firewall-cmd --zone=public --add-port=80/tcp --permanent
	firewall-cmd --reload

## <a name="n1"></a>设置开机启动
	vim /etc/rc.d/rc.local
	#加入以下命令
	source /etc/profile
	/usr/local/tomcat/bin/startup.sh

## 完毕
