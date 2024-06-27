import { Module } from "@nestjs/common";
import { AccountInfoService } from "../Service/accountInfo.service";
import { AccountController } from "../Controller/accountInfo.controller";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { CommentController } from "src/Controller/comment.controller";
import { CommentService } from "src/Service/comment.service";
import { CommentManager } from "src/Manager/comment.manager";
import Like from "src/Model/like.model";
import { LikeManager } from "src/Manager/like.manager";
import { LikeService } from "src/Service/like.service";
import { LikeController } from "src/Controller/like.controller";
import { FollowerManager } from "src/Manager/follower.manager";
import { FollowerService } from "src/Service/follower.service";
import { FollowerController } from "src/Controller/follower.controller";
import Comment from "src/Model/comment.model";

@Module({

  controllers: [AccountController],
  providers: [AccountInfoService, AccountInfoManager],
  
  
})
export class AccountInfoModule { }
