---
layout: post
title:  mapreduce模板
date: 2021-02-10
tags: 博客
---

mapreduce的mapper、reducer可以是python脚本、shell脚本、二进制可执行文件，只要定义好输入输出即可。

下面以去重运算示例：

## 1. mapper

	import sys 
	
	# generator for mapreduce
	def line_generator():
	    for line in sys.stdin:
	        yield line
	
	# main process for the mapping
	def mapping():
	    for line in line_generator():
	        sys.stdout.write(line)
	
	
	if __name__ == "__main__":
	    mapping()


## 2. reducer

	import sys
	
	
	# generator for mapreduce
	def line_generator():
	    for line in sys.stdin:
	        yield line
	
	def reducer():
	    lastKey = False
	
	    for line in line_generator():
	        arr = line.strip("\n").split("\t")
	        curKey = arr[0]
	        if lastKey and curKey != lastKey: # different key, save and calulate next line
	            sys.stdout.write("%s\n"%(lastKey))
	        else: # same key
	            pass
	        lastKey = curKey
	    
	    if lastKey:
	        sys.stdout.write("%s\n"%(lastKey))
	
	if __name__ == "__main__":
	    reducer()
	    
	    
    
## 3. 提交脚本

	#!/bin/bash
	
	source ~/env.sh
	
	INPUT_PATH=xxx
	OUTPUT_PATH=xxx
	STREAM_JAR_PATH=/usr/local/service/hadoop/share/hadoop/tools/lib/hadoop-streaming-2.7.3.jar
	cur_date=$(date +'%Y%m%d')
	APP_NAME="xxx"
	
	#-D mapred.textoutputformat.ignoreseparator=true \
	$HADOOP_HOME/bin/hadoop jar $STREAM_JAR_PATH \
	    -D mapreduce.map.memory.mb=4000 \
	    -D mapreduce.reduce.memory.mb=4000 \
	    -D mapred.max.map.failures.percent=20 \
	    -D mapreduce.job.maps=24 \
	    -D mapred.job.map.capacity=24 \
	    -D mapreduce.job.reduces=1 \
	    -D mapred.job.priority=VERY_HIGH \
	    -D mapreduce.job.name=$APP_NAME \
	    -D stream.map.input=org.apache.hadoop.mapred.TextInputFormat  \
	    -D stream.map.output=org.apache.hadoop.mapred.TextMultiOutputFormat \
	    -D mapreduce.job.queuename="main_queue" \
	    -D mapreduce.output.fileoutputformat.compress=true \
	    -D mapreduce.output.fileoutputformat.compress.codec=org.apache.hadoop.io.compress.GzipCodec \
	    -files /data/map.py,/data/reduce.py \
	    -mapper "python map.py " \
	    -reducer "python reduce.py " \
	    -input "$INPUT_PATH" \
	    -output "$OUTPUT_PATH"