import { Module } from "@nestjs/common";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { UniswapV2PairEventHandler } from "../Service/contractEventHandler/uniswapV2PairEvent.handler";
import { CommentManager } from "../Manager/comment.manager";
@Module({
  providers: [
    UniswapV2PairEventHandler,
    AccountInfoManager,
    CommentManager
  ],
})
export class TaskModule {}
