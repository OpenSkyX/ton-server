import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SequelizeModule } from "@nestjs/sequelize";
import config from "./Config";
import AccountInfo from "./Model/accountInfo.model";


import { AccountInfoModule } from "./Module/accountInfo.module";
import { TaskDaoRewardService } from "./Service/task/taskDaoReward.servict";
import Comment from "./Model/comment.model";
import Like from "./Model/like.model";
import Follower from "./Model/follower.model";
import { LikeModule } from "./Module/like.module";
import { FollowerModule } from "./Module/follower.module";
import { CommentModule } from "./Module/Comment.module";
import CoinList from "./Model/coinlist.model";
import { CoinListModule } from "./Module/coinlist.moudule";
import Message from "./Model/message.model";
import { MessageModule } from "./Module/message.module";



/**
 * @Module() 定义一个模块，并管理这个模块的导入集合、控制器集合、提供者集合、导出集合
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: "mysql", // 数据库类型，sequelize支持  Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 且对数据库版本有要求。
      host: config.db.host, // 主机ip
      port: config.db.port, // 数据库端口 mysql默认在3306端口
      username: config.db.user, // 数据库用户名
      password: config.db.password, // 数据库密码
      database: config.db.database, // 具体数据库
      logging: config.isDev && true,
      // logging:  true,
      timezone: "+08:00", //东八时区
      autoLoadModels: config.autoCreateTable,
      synchronize: config.autoCreateTable, //自动建表
      models: [
        AccountInfo,
        Comment,
        Like,
        Follower,
        CoinList,
        Message
      ], // 要开始使用模型，我们需要通过将其插入到`forRoot()`方法选项的`models`数组中来让`Sequelize`知道它的存在。
    }),
    AccountInfoModule,
    TaskDaoRewardService,
    LikeModule,
    FollowerModule,
    CommentModule,
    CoinListModule,
    MessageModule,
  ],
})
export class AppModule {}
