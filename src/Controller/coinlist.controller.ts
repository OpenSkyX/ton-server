import { Body, Controller, Get, Logger, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateCoinRequest } from "../Common/ReqRspParam/CreateCoinRequst";
import { LikeRequest } from "../Common/ReqRspParam/LikeRequest";
import { SearchCoinRequest,SearchCoinForMeRequest } from "../Common/ReqRspParam/SearchCoinRequest";
import { ErrorHandler } from "../Common/Response/ErrorHandler";
import { CoinListService } from "../Service/coinlist.service";
import { broadcastMessage } from "../wss/WssServer";
import { TraderRequest } from "../Common/ReqRspParam/TraderRequest";
import Transaction from "../Model/transaction.model";
import { HoldersRequest } from "../Common/ReqRspParam/HoldersRequest";
import { convertToOHLC, generateKLineData } from "../Common/Utils/BuildKline";
import { Op } from "sequelize";
import AccountInfo from "../Model/accountInfo.model";


@ApiTags("token")
@Controller("token")
export class CoinListController {

    private logger = new Logger(CoinListController.name);

    constructor(private service: CoinListService) { }

    @Post("create")
    async create(@Body() coinlistRequest: CreateCoinRequest) {
        const user = await AccountInfo.findOne({ where: { id: coinlistRequest.creatorUserId } })
        if (!user) {
            return "user not exist";
        }
        const messageBody = {
            title: "createCoin",
            account: user,
            coin: coinlistRequest
        }
        broadcastMessage(JSON.stringify(messageBody));
        return this.service.createCoin(coinlistRequest).catch(ErrorHandler.handlerError);
    }

    @Get("list")
    async getCoinList(@Query() search: SearchCoinRequest) {
        return this.service.getCoinList(search).catch(ErrorHandler.handlerError);
    }

    @Get("KingOfTheHill")
    async KingOfTheHill() {
    
        return this.service.KingOfTheHill().catch(ErrorHandler.handlerError);
    }

    @Get("listForMe")
    async getCoinListForMe(@Query() search: SearchCoinForMeRequest) {
        if (!search.userId) {
            return "userId is null";
        }
        return this.service.getCoinListForMe(search).catch(ErrorHandler.handlerError);
    }

    @Get("searchToken")
    async searchToken(@Query() search: SearchCoinRequest) {
        return this.service.searchToken(search).catch(ErrorHandler.handlerError);
    }

    @Post("trader")
    async trader(@Body() traderRequest: TraderRequest) {
        const user = await AccountInfo.findOne({ where: { id: traderRequest.userId } })
        if (!user) {
            return ErrorHandler.handlerError("user not found")
        }
        const messageBody = {
            title: "trader",
            accountInfo: user,
            trader: traderRequest
        }
        broadcastMessage(JSON.stringify(messageBody));
        return this.service.trader(traderRequest).catch(ErrorHandler.handlerError);
    }

    @Get("KLine/:token/:interval")
    async KLine(@Param("token") token: string, @Param("interval") interval: number) {
        const data = await Transaction.findAll(
            {
                where: { token: token },
                limit: 10000,
                // order: [["timestamp", "DESC"]],
            });
        // const interval = 60000;
        // const Kdata = generateKLineData(data, interval);

        //根据前端要求只发送最近的300条数据
        const kData = (await convertToOHLC(data, interval)).slice(-300);
    
        return {kLineData: kData,total:kData.length};
    }

    //获取某个时间段的交易数据 
    @Get("getLastKLine/:token/:interval/")
    async getKLineDataByTimestemps(
        @Param("token") token: string,
        @Param("interval") interval: number
    ) {
        // const data = await Transaction.findAll({ where: { token: token ,timestamp:{[Op.gt]: currentTimestemps} } });

        // const kData = await generateKLineData(data,parseInt(interval))
        // return kData;
        // return this.service.getKLineDataByTimestemps(token, interval, currentTimestemps).catch(ErrorHandler.handlerError);;
        return this.service.getLastKlineBar(token, interval).catch(ErrorHandler.handlerError);
    }

    @Get("holders/:address")
    async holders(@Param("address") address: string) {

        return this.service.holders(address).catch(ErrorHandler.handlerError);
    }

    @Get("tx")
    async getTxs(@Query() body: HoldersRequest) {
        return this.service.transactions(body).catch(ErrorHandler.handlerError);
    }

    @Get("latest")
    async getNewCoin(){
        return this.service.getNewCoin().catch(ErrorHandler.handlerError);
    }






}