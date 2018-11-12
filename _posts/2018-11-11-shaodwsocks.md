<link href="http://cdn.bootcss.com/highlight.js/8.0/styles/monokai_sublime.min.css" rel="stylesheet">  
<script src="http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js"></script>  
<script >hljs.initHighlightingOnLoad();</script> 
#CentOS7安装shadowsocks
#目录
##1.环境
##2.安装准备
##3.安装pip
##4.安装shadowsocks
##5.配置shadowsocks
##6.启动与停止
##7.设置开机自启

##环境

###CentOS7+python2.7+pip18.0

##安装准备

由于CentOS7自带了python2.7, 所以只需要安装pip18.
(注意，CentOS6自带的是python2.6, 是无法安装pip18的，所以必须安装python2.7及以上版本)

##安装pip

查看python版本:

	python -V

首先安装epel扩展源和setuptools：

	#安装epel扩展源
	yum -y install epel-release
	#安装setuptools
	wget --no-check-certificate https://bootstrap.pypa.io/ez_setup.py
	python ez_setup.py --insecure

更新完成之后，就可安装pip:

	yum -y install python-pip
	#安装完成之后清除cache：
	yum clean all
	
	*******如果上述命令未成功，可以试试命令******
	wget https://pypi.python.org/packages/11/b6/abcb525026a4be042b486df43905d6
	893fb04f05aac21c32c638e939e447/pip-9.0.1.tar.gz#md5=35f01da33009719497f01a4ba69d63c9
	再执行 tar -zxxf pip-9.0.1.tar.gz
	#进入pip目录 cd pip-9.0.1
	执行 python setup.py install

安装完之后,是pip9, 更新为pip18

	pip install --upgrade pip

##查看pip版本:

	pip -V

##安装shadowsocks

	pip install shadowsocks

##配置shadowsocks

文件位置: /etc/shadowsocks.json （请注意代码中有无引号
	
	{
	    "server":"your_server_ip",
	    "server_port":your port,
	    "local_address": "127.0.0.1",
	    "local_port":1080,
	    "password":"your password",
	    "timeout":600,
	    "method":"aes-256-cfb",
	    "fast_open": false,
	    "workers": 1
	}

各字段的含义:

server:服务器 IP (IPv4/IPv6)，注意这也将是服务端监听的 IP 地址

server_port:监听的服务器端口

local_address:本地监听的 IP 地址

local_port:本地端端口

password:用来加密的密码

timeout:超时时间（秒）

method：加密方法:可选择 “bf-cfb”, “aes-256-cfb”, “des-cfb”, “rc4”, 等等。默认是一种不安全的加密:推荐用 “aes-256-cfb”

fast_open:true 或 false

##启动与停止

	ssserver -c /etc/shadowsocks.json -d start #启动 
	ssserver -c /etc/shadowsocks.json -d stop #停止

##设置开机自启

vim /etc/rc.local，加入以下代码:

	source /etc/profile
	ssserver -c /etc/shadowsocks.json -d start

注:rc.local是开机时会自动加载的文件。




##完毕





