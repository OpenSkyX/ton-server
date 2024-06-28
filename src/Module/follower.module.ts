
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Comment from '../Model/comment.model';
import Like from '../Model/like.model';
import { CommentManager } from '../Manager/comment.manager';
import { CommentService } from '../Service/comment.service';
import Follower from '../Model/follower.model';
import { FollowerController } from '../Controller/follower.controller';
import { FollowerManager } from '../Manager/follower.manager';
import { FollowerService } from '../Service/follower.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Follower,Comment, Like]), // Ensure models are included here
  ],
  controllers: [FollowerController], // Ensure CommentController is not listed as a controller
  providers: [FollowerManager,FollowerService,CommentManager,CommentService], // Ensure CommentManager is listed as a provider
})
export class FollowerModule {}