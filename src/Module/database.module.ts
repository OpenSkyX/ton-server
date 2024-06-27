import { SequelizeModule } from "@nestjs/sequelize";
import { Module } from "@nestjs/common";
@Module({
    imports: [
        SequelizeModule.forRoot({
        // 其他配置项...
        logging: (sql, timing) => {
          console.log(`SQL Query: ${sql}`); // 打印 SQL 查询语句
          console.log(`Execution Time: ${timing}ms`); // 打印执行时间
        },
      }),
    ],
  })
  export class DatabaseModule {}