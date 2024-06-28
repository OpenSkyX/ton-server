
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Comment from '../Model/comment.model';
import Like from '../Model/like.model';
import { LikeController } from '../Controller/like.controller';
import { LikeManager } from '../Manager/like.manager';
import { LikeService } from '../Service/like.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, Like]), // Ensure models are included here
  ],
  controllers: [LikeController], // Ensure CommentController is not listed as a controller
  providers: [LikeManager,LikeService], // Ensure CommentManager is listed as a provider
})
export class LikeModule {}