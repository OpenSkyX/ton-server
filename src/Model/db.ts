import { Sequelize } from "sequelize-typescript";
import config from "../Config";
import AccountInfo from "./accountInfo.model";

export const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  models: [AccountInfo], // 注册模型
  dialect: "mysql",
  timezone: "+08:00", //东八时区
  logging: true, // 启用日志记录
  // logging: (sql, timing) => {
  //   console.log(`SQL Query: ${sql}`); // 打印 SQL 查询语句
  //   console.log(`Execution Time: ${timing}ms`); // 打印执行时间
  // },
});