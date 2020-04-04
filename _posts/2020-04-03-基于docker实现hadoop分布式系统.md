---
layout: post
title:  基于docker实现hadoop分布式系统
date: 2020-04-03
tags: 博客
---

Hadoop的搭建有三种方式，单机版适合开发调试；伪分布式版，适合模拟集群学习；完全分布式，生产使用的模式。这篇文件介绍如何基于docker搭建完全分布式的hadoop集群，一个主节点，三个数据节点为例来讲解。

思路是首先将第一台机器配置好，再将hadoop、Java、/etc/profile三个文件(夹)分发给所有机器。为了简单起见，这里假设有三个机器作为资源节点：hadoop102、hadoop103、hadoop104。每台机器上存储一个DataNode和一个NodeManager。然后实际情况下，NameNode和secondaryNameNode和ResourceManager分别占用一台机器，我们可以称他们三位是系统的管理者。所以实际的分布式系统一般至少6台机器的。这里因为硬件不够，我们把三位管理者分别部署到已有的三台机器上也可。

由于硬件受限，这里我们用的不是三台物理机器，而是在一台物理机器上搭建了三个容器，给出容器的虚拟ip，和三台物理机器操作时差别并不大。

# 一、基础环境

## 环境准备

### 1、软件版本

jdk使用1.8版本，下载地址：

hadoop使用2.7.3版本，下载地址：http://apache.claz.org/hadoop/common/hadoop-2.7.3/hadoop-2.7.3.tar.gz

### 2、host配置和主机名（三台）

三台容器配置，系统：centos7.2、内存：2G、硬盘：10G

给三台服务器分配IP地址（比如）：192.168.0.102/103/104

规划：102作主节点，同时将三台作为数据节点102、103、104

修改三台服务器的hosts文件

    $ vim /etc/hosts

    192.168.0.102 hadoop102
    192.168.0.103 hadoop103
    192.168.0.104 hadoop104


    $ vi /etc/sysconfig/network

    HOSTNAME=hadoop102

执行reboot后生效，完成之后依次修改其它容器为： hadoop103~hadoop104。

### 3、先安装jdk

    建议使用yum安装jdk,也可以自行下载安装

    yum -y install java-1.7.0-openjdk*
    配置环境变量，修改配置文件vim /etc/profile

    export JAVA_HOME=/usr/lib/jvm/jre-1.7.0-openjdk.x86_64
    export PATH=$JAVA_HOME/bin:$PATH
    export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
    使用souce命令让立刻生效

    source /etc/profile

## 免密登陆

### 1、首先关闭每个容器的防火墙和SELINUX

    查看防火墙状态
    service iptables status
    关闭防火墙
    service iptables stop
    chkconfig iptables off
    关闭SELINUX后，需要重启服务器

    -- 关闭SELINUX
    # vim /etc/selinux/config
    -- 注释掉
    #SELINUX=enforcing
    #SELINUXTYPE=targeted
    -- 添加
    SELINUX=disabled

### 2、免密码登录本机

下面以配置hadoop102本机无密码登录为例进行讲解，用户需参照下面步骤完成hadoop103~104的本机无密码登录；

    1）生产秘钥

    ssh-keygen -t rsa
    2）将公钥追加到”authorized_keys”文件

    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    3）赋予权限

    chmod 600 .ssh/authorized_keys
    4）验证本机能无密码访问

    ssh hadoop102
    最后，依次配置hadoop103~hadoop104无密码访问

### 3、hadoop-master本机无密码登录hadoop-slave1、hadoop-slave2、hadoop-slave3，以hadoop-master无密码登录hadoop-slave1为例进行讲解：

1）登录hadoop-slave1 ，复制hadoop-master服务器的公钥”id_rsa.pub”到hadoop-slave1服务器的”root”目录下。

    scp root@hadoop-master:/root/.ssh/id_rsa.pub /root/

2）将hadoop-master的公钥（id_rsa.pub）追加到hadoop-slave1的authorized_keys中

    cat id_rsa.pub >> .ssh/authorized_keys
    rm -rf  id_rsa.pub

3）在 hadoop-master上面测试

    ssh  hadoop-slave1

### 4、配置hadoop-slave1~hadoop-slave3本机无密码登录hadoop-master

下面以hadoop-slave1无密码登录hadoop-master为例进行讲解，用户需参照下面步骤完成hadoop-slave2~hadoop-slave3无密码登录hadoop-master。

1）登录hadoop-master，复制hadoop-slave1服务器的公钥”id_rsa.pub”到hadoop-master服务器的”/root/”目录下。

scp root@hadoop-slave1:/root/.ssh/id_rsa.pub /root/
2）将hadoop-slave1的公钥（id_rsa.pub）追加到hadoop-master的authorized_keys中。

cat id_rsa.pub >> .ssh/authorized_keys
rm -rf  id_rsa.pub //删除id_rsa.pub
3）在 hadoop-slave1上面测试

ssh  hadoop-master
依次配置 hadoop-slave2、hadoop-slave3

到此主从的无密登录已经完成了。

# 二、Hadoop环境搭建

每台机器上hadoop配置文件主要有7(1+3+3)个:

`1`是`core-site.xml`：核心配置文件，指定HDFS中NameNode的地址和指定Hadoop运行时产生文件的存储目录。


`3`是`hdfs-env.sh`、`mapred-env.sh`、`yarn-env.sh`。这3个文件主要就是配置一行JAVA_HOME就可以啦，很简单！


`3`是`hdfs-site.xml`、`mapred-site.xml`、`yarn-site.xml`。这三个文件是主要配置文件。

## 配置hadoop-master的hadoop环境

## hadoop-master上 解压缩安装包及创建基本目录

    #下载
    wget http://apache.claz.org/hadoop/common/hadoop-2.7.3/hadoop-2.7.3.tar.gz
    #解压
    tar -xzvf  hadoop-2.7.3.tar.gz    -C /usr/local
    #重命名
    mv  hadoop-2.7.3  hadoop

## 配置hadoop-master的hadoop环境变量

### 1、配置环境变量，修改配置文件vi /etc/profile

    export HADOOP_HOME=/usr/local/hadoop
    export PATH=$PATH:$HADOOP_HOME/bin
    使得hadoop命令在当前终端立即生效

    source /etc/profile
    下面配置，文件都在：/usr/local/hadoop/etc/hadoop路径下

### 2、配置core-site.xml

修改Hadoop核心配置文件/usr/local/hadoop/etc/hadoop/core-site.xml，通过fs.default.name指定NameNode的IP地址和端口号，通过hadoop.tmp.dir指定hadoop数据存储的临时文件夹。

    <configuration>
        <property>
            <name>hadoop.tmp.dir</name>
            <value>file:/usr/local/hadoop/tmp</value>
            <description>Abase for other temporary directories.</description>
        </property>
        <property>
            <name>fs.defaultFS</name>
            <value>hdfs://hadoop-master:9000</value>
        </property>
    </configuration>

特别注意：如没有配置hadoop.tmp.dir参数，此时系统默认的临时目录为：/tmp/hadoo-hadoop。而这个目录在每次重启后都会被删除，必须重新执行format才行，否则会出错。

### 3、配置hdfs-site.xml：

修改HDFS核心配置文件/usr/local/hadoop/etc/hadoop/hdfs-site.xml，通过dfs.replication指定HDFS的备份因子为3，通过dfs.name.dir指定namenode节点的文件存储目录，通过dfs.data.dir指定datanode节点的文件存储目录。

    <configuration>
        <property>
            <name>dfs.replication</name>
            <value>3</value>
        </property>
        <property>
            <name>dfs.name.dir</name>
            <value>/usr/local/hadoop/hdfs/name</value>
        </property>
        <property>
            <name>dfs.data.dir</name>
            <value>/usr/local/hadoop/hdfs/data</value>
        </property>
    </configuration>

### 4、配置mapred-site.xml

拷贝mapred-site.xml.template为mapred-site.xml，在进行修改

    $ cp /usr/local/hadoop/etc/hadoop/mapred-site.xml.template /usr/local/hadoop/etc/hadoop/mapred-site.xml
    $ vim /usr/local/hadoop/etc/hadoop/mapred-site.xml
    <configuration>
      <property>
          <name>mapreduce.framework.name</name>
          <value>yarn</value>
      </property>
       <property>
          <name>mapred.job.tracker</name>
          <value>http://hadoop-master:9001</value>
      </property>
    </configuration>

### 5、配置yarn-site.xml

    <configuration>
    <!-- Site specific YARN configuration properties -->
        <property>
            <name>yarn.nodemanager.aux-services</name>
            <value>mapreduce_shuffle</value>
        </property>
        <property>
            <name>yarn.resourcemanager.hostname</name>
            <value>hadoop-master</value>
        </property>
    </configuration>

### 6、配置masters文件

修改/usr/local/hadoop/etc/hadoop/masters文件，该文件指定namenode节点所在的服务器机器。删除localhost，添加namenode节点的主机名hadoop-master；不建议使用IP地址，因为IP地址可能会变化，但是主机名一般不会变化。

    vi /usr/local/hadoop/etc/hadoop/masters
    ## 内容
    hadoop-master

### 7、配置slaves文件（Master主机特有）

修改/usr/local/hadoop/etc/hadoop/slaves文件，该文件指定哪些服务器节点是datanode节点。删除locahost，添加所有datanode节点的主机名，如下所示。

    vi /usr/local/hadoop/etc/hadoop/slaves
    ## 内容
    hadoop-slave1
    hadoop-slave2
    hadoop-slave3

配置hadoop-slave的hadoop环境
下面以配置hadoop-slave1的hadoop为例进行演示，用户需参照以下步骤完成其他hadoop-slave2~3服务器的配置。

1）复制hadoop到hadoop-slave1节点

scp -r /usr/local/hadoop hadoop-slave1:/usr/local/
登录hadoop-slave1服务器，删除slaves内容

    rm -rf /usr/local/hadoop/etc/hadoop/slaves

2）配置环境变量

    vi /etc/profile
    ## 内容
    export HADOOP_HOME=/usr/local/hadoop
    export PATH=$PATH:$HADOOP_HOME/bin
    使得hadoop命令在当前终端立即生效；

    source /etc/profile

依次配置其它slave服务

# 三、启动集群

## 1、格式化HDFS文件系统

进入master的~/hadoop目录，执行以下操作

    bin/hadoop namenode -format

格式化namenode，第一次启动服务前执行的操作，以后不需要执行。

## 2、然后启动hadoop：

    sbin/start-all.sh

## 3、使用jps命令查看运行情况

    #master 执行 jps查看运行情况
    25928 SecondaryNameNode
    25742 NameNode
    26387 Jps
    26078 ResourceManager
    #slave 执行 jps查看运行情况
    24002 NodeManager
    23899 DataNode
    24179 Jps

## 4、命令查看Hadoop集群的状态

通过简单的jps命令虽然可以查看HDFS文件管理系统、MapReduce服务是否启动成功，但是无法查看到Hadoop整个集群的运行状态。我们可以通过hadoop dfsadmin -report进行查看。用该命令可以快速定位出哪些节点挂掉了，HDFS的容量以及使用了多少，以及每个节点的硬盘使用情况。

    hadoop dfsadmin -report

输出结果：

    Configured Capacity: 50108030976 (46.67 GB)
    Present Capacity: 41877471232 (39.00 GB)
    DFS Remaining: 41877385216 (39.00 GB)
    DFS Used: 86016 (84 KB)
    DFS Used%: 0.00%
    Under replicated blocks: 0
    Blocks with corrupt replicas: 0
    Missing blocks: 0
    Missing blocks (with replication factor 1): 0
    ......

## 5、hadoop 重启

    sbin/stop-all.sh
    sbin/start-all.sh
