import { Body,  Controller,  Get,  Logger,  Param,  Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateCoinRequest } from "../Common/ReqRspParam/CreateCoinRequst";
import { LikeRequest } from "../Common/ReqRspParam/LikeRequest";
import { SearchCoinRequest } from "../Common/ReqRspParam/SearchCoinRequest";
import { ErrorHandler } from "../Common/Response/ErrorHandler";
import { CoinListService } from "../Service/coinlist.service";
import { broadcastMessage } from "../wss/WssServer";


@ApiTags("token")
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

    @Get("searchToken")
    async searchToken(@Query() search:SearchCoinRequest){
        return this.service.searchToken(search).catch(ErrorHandler.handlerError);
    }


}