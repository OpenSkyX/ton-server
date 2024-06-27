
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Comment from 'src/Model/comment.model';
import Like from 'src/Model/like.model';
import { CommentController } from 'src/Controller/comment.controller';
import { CommentManager } from 'src/Manager/comment.manager';
import { CommentService } from 'src/Service/comment.service';
import { LikeController } from 'src/Controller/like.controller';
import { LikeManager } from 'src/Manager/like.manager';
import { LikeService } from 'src/Service/like.service';
import Message from 'src/Model/message.model';
import { MessageController } from 'src/Controller/message.controller';
import { MessageManager } from 'src/Manager/message.manager';
import { MessageService } from 'src/Service/message.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Message]), // Ensure models are included here
  ],
  controllers: [MessageController], // Ensure CommentController is not listed as a controller
  providers: [MessageManager,MessageService], // Ensure CommentManager is listed as a provider
})
export class MessageModule {}