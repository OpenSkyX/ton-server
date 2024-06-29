#!/bin/bash
# e^3Rrxi&
# 定义服务器信息
PROJECT_NAME='ton-pump-server'
SERVER_USER="root"
SERVER_IP="16.163.205.151"
REMOTE_DIR="/home/ton-pump-server"
REPO_URL="https://github.com/OpenSkyX/ton-server.git"

# SSH 连接到服务器并执行部署命令
ssh $SERVER_USER@$SERVER_IP <<EOF
  cd $REMOTE_DIR

  # 备份当前项目
  if [ -d "$PROJECT_NAME" ]; then
    mv $PROJECT_NAME ${PROJECT_NAME}_backup_$(date +%s)
  fi

  # 拉取最新的代码
  git clone $REPO_URL $PROJECT_NAME

  # 进入项目目录
  cd $PROJECT_NAME
  
  # 安装依赖
  yarn install

  # 构建应用程序
  yarn buildMac
  
  # 进入 dist 目录
  cd $REMOTE_DIR + /$PROJECT_NAME/dist

  # 安装依赖
  yarn install

  # 启动应用程序
  chmod 777 ./start.sh
  
  # 如果服务正在运行，停止并删除服务
  if pm2 show $PROJECT_NAME >/dev/null 2>&1; then
    echo "Stopping and deleting existing service '$PROJECT_NAME'..."
    pm2 delete $PROJECT_NAME
  fi

  # 启动新的服务
  pm2 start ./start.sh --name $PROJECT_NAME

  echo "部署完成！"

  # 等待10秒
  sleep 10

  # 查看前100行日志
  pm2 logs $PROJECT_NAME --lines 100

  exit
EOF
