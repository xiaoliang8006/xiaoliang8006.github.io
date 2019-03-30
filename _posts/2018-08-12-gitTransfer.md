---
layout: post
title: 用Git上传与下载
date: 2018-08-12 
tags: 工具
---

# Git Transfer

## 介绍

用Git上传与下载

#####  说明：xiaoliang8006为用户名   xiaoliang8006.github.io为仓库名 

# 目录


* [下载仓库](#n1)
* [上传git文件](#n2)
* [新上传仓库](#n3)
* [远程仓库相关命令](#n4)
* [分支(branch)操作相关命令](#n5)

## <a name="n1"></a>下载仓库
	#两种方式:
	git clone git@github.com:xiaoliang8006/xiaoliang8006.github.io.git
	git clone https://github.com/xiaoliang8006/xiaoliang8006.github.io.git
	

## <a name="n2"></a>上传git文件

	1. 在要上传的工程master下（工程里面目录），右键—>GitBash，或者打开cmd切到本目录
	2. git status
	3. git add . -A
	4. git commit -m "更新说明"
	5. git push git@github.com:xiaoliang8006/xiaoliang8006.github.io.git master

## <a name="n3"></a>新上传仓库
	
	1. 在要上传的工程master下，右键—>GitBash，或者打开cmd切到本目录
	2. git init
	3. git add . -A
	4. git commit -m "更新说明"
	5. git remote add origin git@github.com:xiaoliang8006/xiaoliang8006.github.io.git   #重新添加
	
	如果提示 git fatal: 远程 origin 已经存在，执行6,再执行5
	6. git remote rm origin     #删除远程配置
	7. git push origin master -f #强制提交

## <a name="n4"></a>远程仓库相关命令
	检出仓库：$ git clone git://github.com/jquery/jquery.git
	查看远程仓库：$ git remote -v
	添加远程仓库：$ git remote add [name] [url]
	删除远程仓库：$ git remote rm [name]
	修改远程仓库：$ git remote set-url --push[name][newUrl]
	拉取远程仓库：$ git pull [remoteName] [localBranchName]
	推送远程仓库：$ git push [remoteName] [localBranchName]
 
## <a name="n5"></a>分支(branch)操作相关命令
	查看本地分支：$ git branch
	查看远程分支：$ git branch -r
	创建本地分支：$ git branch [name] ----注意新分支创建后不会自动切换为当前分支
	切换分支：$ git checkout [name]
	创建新分支并立即切换到新分支：$ git checkout -b [name]
	删除分支：$ git branch -d [name] ---- -d选项只能删除已经参与了合并的分支，对于未有合并的分支是无法删除的。如果想强制删除一个分支，可以使用-D选项
	合并分支：$ git merge [name] ----将名称为[name]的分支与当前分支合并
	创建远程分支(本地分支push到远程)：$ git push origin [name]
	删除远程分支：$ git push origin :heads/[name]

我从master分支创建了一个issue5560分支，做了一些修改后，使用git push origin master提交，但是显示的结果却是'Everything up-to-date'，发生问题的原因是git push origin master 在没有track远程分支的本地分支中默认提交的master分支，因为master分支默认指向了origin master 分支，这里要使用git push origin issue5560：master 就可以把issue5560推送到远程的master分支了。

如果想把本地的某个分支test提交到远程仓库，并作为远程仓库的master分支，或者作为另外一个名叫test的分支，那么可以这么做。

	$ git push origin test:master         // 提交本地test分支作为远程的master分支 //好像只写这一句，远程的github就会自动创建一个test分支
	$ git push origin test:test              // 提交本地test分支作为远程的test分支

如果想删除远程的分支呢？类似于上面，如果:左边的分支为空，那么将删除:右边的远程的分支。

	$ git push origin :test              // 刚提交到远程的test将被删除，但是本地还会保存的，不用担心

## 完毕
