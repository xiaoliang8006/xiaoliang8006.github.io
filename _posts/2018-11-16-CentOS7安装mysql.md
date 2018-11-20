---
layout: post
title: shadowsocks
date: 2018-11-16 
tags: 博客 
---

# centos7 mysql数据库安装和配置

# 目录

## 系统环境

## mysql安装

### 方法一：安装mariadb

### 方法二：官网下载安装mysql-server

## 配置mysql

### 1.编码

### 2、远程连接设置

***

## 系统环境

    CentOS7
    cat /etc/redhat-release #查看系统版本

## mysql安装

	# yum install mysql
	# yum install mysql-server
	# yum install mysql-devel

安装mysql和mysql-devel都成功，但是安装mysql-server失败。显示

	No package mysql-server available.

查资料发现是CentOS 7 版本将MySQL数据库软件从默认的程序列表中移除，用mariadb代替了。

有两种解决办法：

## 方法一：安装mariadb

MariaDB数据库管理系统是MySQL的一个分支，主要由开源社区在维护，采用GPL授权许可。开发这个分支的原因之一是：甲骨文公司收购了MySQL后，有将MySQL闭源的潜在风险，因此社区采用分支的方式来避开这个风险。MariaDB的目的是完全兼容MySQL，包括API和命令行，使之能轻松成为MySQL的代替品。

安装mariadb，大小59 M。

	yum install mariadb-server mariadb 

	mariadb数据库的相关命令是：
	systemctl start mariadb  #启动MariaDB
	systemctl stop mariadb  #停止MariaDB
	systemctl restart mariadb  #重启MariaDB
	systemctl enable mariadb  #设置开机启动

所以先启动数据库

	# systemctl start mariadb
然后就可以正常使用mysql了

 	mysql -u root -p

安装mariadb后显示的也是 MariaDB [(none)]> ，可能看起来有点不习惯。下面是第二种方法。

## 方法二：官网下载安装mysql-server

	# wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm
	# rpm -ivh mysql-community-release-el7-5.noarch.rpm
	# yum install mysql-community-server
安装成功后重启mysql服务。

	# service mysqld restart
初次安装mysql，root账户没有密码。
	
	# mysql -u root 
	mysql> show databases; 
设置密码

	mysql> set password for 'root'@'localhost' =password('password');
不需要重启数据库即可生效。安装完以后mariadb自动就被替换了，将不再生效。

	 rpm -qa |grep mariadb #因此将查询不到该包

## 配置mysql
### 1、编码
mysql配置文件为/etc/my.cnf

最后加上编码配置

	[mysql]
	default-character-set =utf8
这里的字符编码必须和/usr/share/mysql/charsets/Index.xml中一致。
## 2、远程连接设置
把在所有数据库的所有表的所有权限赋值给位于所有IP地址的root用户。

	mysql> grant all privileges on *.* to root@'%'identified by 'password';
如果是新用户而不是root，则要先新建用户

	mysql>create user 'username'@'%' identified by 'password';  
此时就可以进行远程连接了。
## 登录

例如

		mysql -hlocalhost -uroot -p12345 -P3306
		-h数据库主机
		-u用户
		-p密码
		-P端口号（大写P）
## 完毕





