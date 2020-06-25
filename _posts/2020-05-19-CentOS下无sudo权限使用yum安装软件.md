---
layout: post
title:  CentOS下无sudo权限使用yum安装软件
date: 2020-04-12
tags: 博客
---


现在很多服务器都是centos系统，而我们在公司使用服务器的时候通常不是root用户，而且没有sudo权限。

其实在linux中，安装软件需要权限通常是因为我们对安装位置没有权限，所以只要把软件安装到我们有权限的位置就行了。

## 1.查看yum中是否有你需要的包

比如安装tmux包，可以查看：

	yum list 'tmux*'

## 2.下载rpm包

然后我们从仓库中下载rpm包，比如我们要下载graphviz.x86_64，我们可以这样下载：

	yumdownloader tmux.x86_64 


## 3.解压RPM包

	rpm2cpio tmux-1.8-4.el7.x86_64.rpm |cpio -idvm
	
## 4.添加到环境变量

vim ~/.bashrc 或 vim ~/.bash_profile均可：

	export PATH=$PATH:$HOME/your/path
	
然后

	$ source ~/.bashrc
	
### 完毕
