
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Message from '../Model/message.model';
import { MessageController } from '../Controller/message.controller';
import { MessageManager } from '../Manager/message.manager';
import { MessageService } from '../Service/message.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Message]), // Ensure models are included here
  ],
  controllers: [MessageController], // Ensure CommentController is not listed as a controller
  providers: [MessageManager,MessageService], // Ensure CommentManager is listed as a provider
})
export class MessageModule {}