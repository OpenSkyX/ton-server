#!/bin/bash

# 检查是否存在 src.zip 文件
if [ -f "src.zip" ]; then
  # 删除 src.bak 目录（如果存在）
  if [ -d "src.bak" ]; then
    echo "Removing src.bak directory..."
    rm -rf src.bak
  fi

  # 备份 src 目录为 src.bak
  if [ -d "src" ]; then
    echo "Backing up src directory..."
    mv src src.bak
  fi

  # 解压 src.zip 文件
  echo "Unzipping src.zip..."
  unzip src.zip

  # 删除 src.zip 文件
  echo "Removing src.zip..."
  rm -rf src.zip

  # 停止应用
  echo "Stopping the application..."
  sh stop.sh

  # 启动应用
  echo "Starting the application..."
  sh start.sh

  # 打印日志
  echo "show log..."
  sh logger.sh

  echo "Script completed."
else
  echo "src.zip file not found. Script aborted."
fi
