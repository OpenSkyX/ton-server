# themisDao-fil-server

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





//DB address nonce

mysql -h 127.0.0.1 -u root -p themisFilServer -P 3306 -e "select A.settle_term_id 结算期,B.address 用户,A.account_node_type 节点等级,A.staked_ths_token_up 个人质押增量,A.kpi_total 分红业绩,A.dao_reward 节点奖励,A.supper_node_reward 平级奖励 from account_term_info A left join account_info B on (A.account_id=B.id) where A.settle_term_id=(select id from settle_term_info order by id desc limit 1) and A.account_node_type>1 order by A.account_node_type desc;;"  > /root/tmp/export/rewardData.txt



#### 目录

* Common : 公共函数及结构题
* Config: 配置文件
* Controller: 暴露接口
* Manager: 面向Db的调用
* Model： DB表对应的结构题
* Service： 核心业务落机
* Service/task：  