
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

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, Like]), // Ensure models are included here
  ],
  controllers: [LikeController], // Ensure CommentController is not listed as a controller
  providers: [LikeManager,LikeService], // Ensure CommentManager is listed as a provider
})
export class LikeModule {}