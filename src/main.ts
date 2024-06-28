import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import config from "./Config";
import { TransformInterceptor } from "./Common/Response/TransformInterceptor";
import { botServe } from "./bot/bot.server";

import { Logger, ValidationPipe } from '@nestjs/common';
import { Swagger } from "./swagger/SwaggerConfigure";
import { startWssServer } from "./wss/WssServer";

async function bootstrap() {
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 自动转换输入数据类型
    whitelist: true, // 移除未定义的属性
    forbidNonWhitelisted: true, // 如果未定义的属性被传递，抛出错误
  }));

  //配置swagger
  Swagger(app);

  app.setGlobalPrefix("/");
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(config.serverPort);
  app.getMicroservices();
  logger.log(`server start success,linten port: ${config.serverPort}`);

  //启动bot
  botServe();
  startWssServer();

  logger.log(`telegram bot server start success`);
}



bootstrap();

