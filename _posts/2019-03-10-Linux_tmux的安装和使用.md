---
layout: post
title:  Linux tmux的安装和使用
date: 2019-03-10
tags: 博客 
---

## 介绍

tmux是一个优秀的终端复用软件，可以切割窗口，也能保证SSH断开后再重连时环境的恢复。

简单地说，tmux主要有两个功能最好用（这应该也是tmux的主要功能）:

* split窗口。可以在一个terminal下打开多个终端，也可以对当前屏幕进行各种split，即可以 同时打开多个显示范围更小的终端。

* 在使用SSH的环境下，避免网络不稳定，导致工作现场的丢失。由于网络不稳定，SSH连接就会断开。如果使用了tmux，重新连接以后，就可以直接回到原来的工作环境，不但提高了工作效率，还降低了风险，增加了安全性。

## 安装

### Ubuntu
	sudo apt-get install tmux

### CentOS7
	yum install -y tmux

## tmux常用按键

这里需要说明一点的是，tmux的任何指令，都包含一个前缀，也就是说，你按了前缀(一组按键，默认是Ctrl+b)以后，系统才知道你接下来的指令是发送给tmux的。



<table>
<tr>
    <td rowspan="30"> 
	Ctrl+b
	 </td>
    <td>?</td>
    <td>显示快捷键帮助 </td>
</tr>
<tr>
    <td> Ctrl+o </td>
    <td>调换窗口位置，类似与vim 里的C-w</td>
</tr>
<tr>
    <td>Space</td>
    <td>采用下一个内置布局</td>
</tr>
<tr>
    <td>!</td>
    <td>把当前窗口变为新窗口</td>
</tr>
<tr>
    <td>"</td>
    <td>模向分隔窗口</td>
</tr>
<tr>
    <td>%</td>
    <td>纵向分隔窗口</td>
</tr>
<tr>
    <td>q</td>
    <td>显示分隔窗口的编号</td>
</tr>
<tr>
    <td>o</td>
    <td>跳到下一个分隔窗口</td>
</tr>
<tr>
    <td>上下键</td>
    <td>上一个及下一个分隔窗口</td>
</tr>
<tr>
    <td>ALT+方向键</td>
    <td>调整分隔窗口大小</td>
</tr>
<tr>
    <td>c</td>
    <td>创建新窗口</td>
</tr>
<tr>
    <td>0~9</td>
    <td>选择几号窗口</td>
</tr>
<tr>
    <td>c</td>
    <td>创建新窗口</td>
</tr>
<tr>
    <td>n</td>
    <td>选择下一个窗口</td>
</tr>
<tr>
    <td>l</td>
    <td>切换到最后使用的窗口</td>
</tr>
<tr>
    <td>p</td>
    <td>选择前一个窗口</td>
</tr>
<tr>
    <td>w</td>
    <td>以菜单方式显示及选择窗口</td>
</tr>
<tr>
    <td>t</td>
    <td>显示时钟</td>
</tr>
<tr>
    <td>;</td>
    <td>切换到最后一个使用的面板</td>
</tr>
<tr>
    <td>x</td>
    <td>关闭面板</td>
</tr>
<tr>
    <td>&</td>
    <td>关闭窗口</td>
</tr>
<tr>
    <td>s</td>
    <td>以菜单方式显示和选择会话</td>
</tr>
<tr>
    <td>,</td>
    <td>给当前窗口改名</td>
</tr>
<tr>
    <td>[</td>
    <td>复制(空格开始)</td>
</tr>
<tr>
    <td>]</td>
    <td>粘贴（回车结束）</td>
</tr>
<tr>
    <td>d</td>
    <td>退出tumx，并保存当前会话，这时，tmux仍在后台运行，可以通过tmux attach进入 到指定的会话</td>
</tr>
</table>

## 配置

我们先来看一下几个配置，这些配置才是我离不开tmux的原因:-)。tmux的配置文件是~/.tmux.conf，这个文件可能不存在，你可以自己新建。下面开始配置，首先，有没有觉得tmux的前缀按起来太不方便了，ctrl与b键隔得太远，很多人把它映射成C+a，也就是在配置文件(~/.tmux.conf)中加入下面这条语句：

##### 后面的配置文件将Crtl+b修改为Crtl+a

mux配置文件

~/.tmux.conf(用户配置)或/etc/tmux.conf（全局配置）

	#-- base --#
	set -g default-terminal "screen"
	set -g display-time 3000
	set -g history-limit 65535
	#----------------------------------------------
	
	#将默认按键前缀改为与C-i避免与终端快捷键冲突
	
	set-option -g prefix C-a
	unbind-key C-b
	bind-key C-a send-prefix
	#----------------------------------------------
	
	#按键绑定
	
	
	#水平或垂直分割窗口 (C+A+ :split-window + v/h)
	unbind '"'
	bind - splitw -v #分割成上下两个窗口
	unbind %
	bind | splitw -h #分割成左右两个窗口
	#----------------------------------------------
	
	#选择分割的窗格
	bind k selectp -U #选择上窗格
	bind j selectp -D #选择下窗格
	bind h selectp -L #选择左窗格
	bind l selectp -R #选择右窗格
	#----------------------------------------------
	
	#重新调整窗格的大小
	bind ^k resizep -U 10
	bind ^j resizep -D 10
	bind ^h resizep -L 10
	bind ^l resizep -R 10
	#----------------------------------------------
	
	#交换两个窗格
	bind ^u swapp -U
	bind ^d swapp -D
	
	bind ^a last
	bind q killp
	#----------------------------------------------
	
	bind '~' splitw htop
	bind ! splitw ncmpcpp
	bind m command-prompt "splitw -h 'exec man %%'"
	
	unbind s
	#----------------------------------------------
	
	#定制状态行
	
	set -g status-left "#[fg=white,bg=blue] > #I < #[default] |" # 0:bash
	#set -g status-left "#[fg=white,bg=blue] > #I < #[default] |" # session-name
	set -g status-right "#[fg=yellow,bright][ #[fg=cyan]#W #[fg=yellow]]#[default] #[fg=yellow,bright]- %Y.%m.%d #[fg=green]%H:%M #[default]"
	set -g status-right-attr bright
	
	set -g status-bg black
	set -g status-fg white
	set -g set-clipboard on
	
	setw -g window-status-current-attr bright
	#setw -g window-status-current-bg red
	setw -g window-status-current-bg green
	setw -g window-status-current-fg white
	
	set -g status-utf8 on
	set -g status-interval 1
	
	#set -g visual-activity on
	#setw -g monitor-activity on
	
	set -g status-keys vi
	#----------------------------------------------
	
	setw -g mode-keys vi
	setw -g mode-mouse on
	
	#setw -g mouse-resize-pane on
	#setw -g mouse-select-pane on
	#setw -g mouse-select-window on
	
	# move x clipboard into tmux paste buffer
	bind C-p run "tmux set-buffer \"$(xclip -o -sel clipbaord)\"; tmux paste-buffer"
	# move tmux copy buffer into x clipboard
	bind C-y run "tmux show-buffer | xclip -i -sel clipbaord"
	
	#默认启动应用
	
	#new -s work # 新建名为 work 的会话，并启动 mutt
	#neww rtorrent # 启动 rtorrent
	#neww vim # 启动 vim
	#neww zsh
	#selectw -t 3 # 默认选择标号为 3 的窗口

