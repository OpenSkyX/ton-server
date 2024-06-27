import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function Swagger(app: any){
    // 创建Swagger选项
  const options = new DocumentBuilder()
  .setTitle('Example API')
  .setDescription('The example API description')
  .setVersion('1.0')
  .addTag('example')
  .build();
// 创建Swagger文档
const document = SwaggerModule.createDocument(app, options);
// 设置`/api`路由为Swagger文档及其UI的主页
SwaggerModule.setup('/api/swagger', app, document);
}