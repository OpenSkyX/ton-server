import { Injectable } from "@nestjs/common";
import { SearchCoinRequest } from "src/Common/ReqRspParam/SearchCoinRequest";
import { CoinListManager } from "src/Manager/coinlist.manager";

@Injectable()
export class CoinListService{

    constructor(private coinManager:CoinListManager) {

     }
     async existCoin(coinAddress:string){
        return await this.coinManager.existCoin(coinAddress);
     }

     async createCoin(createCoin:any){
        return await this.coinManager.createCoin(createCoin);
     }

     async getCoinList(search:SearchCoinRequest){
        return await this.coinManager.getCoinList(search);
     }

       async getCoinListForMe(search:SearchCoinRequest){
         return await this.coinManager.getCoinListForMe(search);
       }
}