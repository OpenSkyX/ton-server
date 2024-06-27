
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Comment from 'src/Model/comment.model';
import Like from 'src/Model/like.model';
import { CommentController } from 'src/Controller/comment.controller';
import { CommentManager } from 'src/Manager/comment.manager';
import { CommentService } from 'src/Service/comment.service';
import Follower from 'src/Model/follower.model';
import { FollowerController } from 'src/Controller/follower.controller';
import { FollowerManager } from 'src/Manager/follower.manager';
import { FollowerService } from 'src/Service/follower.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Follower,Comment, Like]), // Ensure models are included here
  ],
  controllers: [FollowerController], // Ensure CommentController is not listed as a controller
  providers: [FollowerManager,FollowerService,CommentManager,CommentService], // Ensure CommentManager is listed as a provider
})
export class FollowerModule {}