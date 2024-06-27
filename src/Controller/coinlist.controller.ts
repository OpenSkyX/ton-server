import { Body,  Controller,  Get,  Logger,  Param,  Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateCoinRequest } from "src/Common/ReqRspParam/CreateCoinRequst";
import { LikeRequest } from "src/Common/ReqRspParam/LikeRequest";
import { SearchCoinRequest } from "src/Common/ReqRspParam/SearchCoinRequest";
import { ErrorHandler } from "src/Common/Response/ErrorHandler";
import { CoinListService } from "src/Service/coinlist.service";
import { broadcastMessage } from "src/wss/WssServer";


@Controller("token")
export class CoinListController{

    private logger = new Logger(CoinListController.name);

    constructor(private service:CoinListService){}

    @Post("create")
    async create(@Body() coinlistRequest:CreateCoinRequest){
        broadcastMessage(JSON.stringify(coinlistRequest));
        return this.service.createCoin(coinlistRequest).catch(ErrorHandler.handlerError);
    }

    @Get("list")
    async getCoinList(@Query() search:SearchCoinRequest){
        return this.service.getCoinList(search).catch(ErrorHandler.handlerError);
    }

    @Get("listForMe")
    async getCoinListForMe(@Query() search:SearchCoinRequest){
        return this.service.getCoinListForMe(search).catch(ErrorHandler.handlerError);
    }


}