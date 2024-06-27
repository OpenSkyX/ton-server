import { Injectable } from "@nestjs/common";
import { Log } from "web3-core";
import config from "../../Config";
import { CommonUtils } from "../../Common/Utils/CommonUtils";
import { getOtherTokenPrice } from "../contract/uniswapV2Pair.service";
import * as memoryCache from "memory-cache";
import { Transaction } from "web3-core";
import { BlockTransactionString } from "web3-eth";

@Injectable()
export class UniswapV2PairEventHandler {
  // constructor(private readonly tokenInfoService: TokenInfoService) {}

  /**
   * @notice 处理usdt-thsToken交易对兑换事件
   * @param event event事件的对象
   */
  async OnUsdtThsTokenPairSwap(event: Log) {


  }

  
}
