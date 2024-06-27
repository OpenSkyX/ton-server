# ton-server

#### 介绍
nodejs后台服务

#### 软件架构
软件架构说明


#### 安装教程
1. 编译
```
npm run  buildWindow
```
2. 下载依赖库
```
cd dist && npm install
```

3. 启动
下来就可以使用pm2管理进程

```
$ pwd
.../dist/

## 研发/测试环境
$ export NODE_ENV='test'; sh ./start.sh

## 生产
$ export NODE_ENV='pro'; sh ./start.sh

```

