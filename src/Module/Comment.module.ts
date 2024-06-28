// account-info.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Comment from '../Model/comment.model';
import Like from '../Model/like.model';
import { CommentController } from '../Controller/comment.controller';
import { CommentManager } from '../Manager/comment.manager';
import { CommentService } from '../Service/comment.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, Like]), // Ensure models are included here
  ],
  controllers: [CommentController], // Ensure CommentController is not listed as a controller
  providers: [CommentManager,CommentService], // Ensure CommentManager is listed as a provider
})
export class CommentModule {}
