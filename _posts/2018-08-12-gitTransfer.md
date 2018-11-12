---
layout: post
title: 用Git上传与下载
date: 2018-08-12 
tags: GitTransfer 
---

# Git Transfer

## 介绍

用Git上传与下载

#####  说明：xiaoliang8006为用户名   xiaoliang8006.github.io为仓库名 

# 目录


* [下载仓库](#n1)
* [上传git文件](#n2)
* [新上传仓库](#n3)



## <a name="n1"></a>下载仓库
	#两种方式:
	git clone git@github.com:xiaoliang8006/xiaoliang8006.github.io.git
	git clone https://github.com/xiaoliang8006/xiaoliang8006.github.io.git
	

## <a name="n1"></a>上传git文件

	1. 在要上传的工程master下（工程里面目录），右键—>GitBash，或者打开cmd切到本目录
	2. git status
	3. git add . -A
	4. git commit -m "更新说明"
	5. git push git@github.com:xiaoliang8006/xiaoliang8006.github.io.git master

## <a name="n1"></a>新上传仓库
	
	1. 在要上传的工程master下，右键—>GitBash，或者打开cmd切到本目录
	2. git init
	3. git add . -A
	4. git commit -m "更新说明"
	5. git remote add origin git@github.com:xiaoliang8006/xiaoliang8006.github.io.git   #重新添加
	
	如果提示 git fatal: 远程 origin 已经存在，执行6,再执行5
	6. git remote rm origin     #删除远程配置
	7. git push origin master -f #强制提交

## 完毕
