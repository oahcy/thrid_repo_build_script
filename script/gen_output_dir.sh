#!/bin/sh

target_dir="/home/yc/code/third_source/output"
dst_dir="/home/yc/code/third_source/dst_output"

include_dir=${dst_dir}/include
lib_dir=${dst_dir}/lib

mkdir -p ${include_dir}
mkdir -p ${lib_dir}

for file in ${target_dir}/*
do
    if test -f $file
    then
        echo $file 是文件
    fi
    if test -d $file
    then
        echo $file 是目录
        include_dst=${include_dir}/$(basename $file)
        mkdir -p ${include_dst}
        lib_dst=${lib_dir}/$(basename $file)
        mkdir -p ${lib_dst}
        if test -d ${file}/include
        then
          cp -r ${file}/include/* ${include_dst}
        fi
        if test -d ${file}/lib
        then
          cp -r ${file}/lib/* ${lib_dst}
        fi
        if test -d ${file}/lib64
        then
          cp -r ${file}/lib64/* ${lib_dst}
        fi
    fi
done
