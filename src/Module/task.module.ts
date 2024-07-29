import { Module } from "@nestjs/common";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { UniswapV2PairEventHandler } from "../Service/contractEventHandler/uniswapV2PairEvent.handler";
import { CommentManager } from "../Manager/comment.manager";
import { TonTransaction } from "../Service/task/TonTransaction.service";
@Module({
  providers: [
    UniswapV2PairEventHandler,
    AccountInfoManager,
    CommentManager,
    TonTransaction,
  ],
})
export class TaskModule {}
