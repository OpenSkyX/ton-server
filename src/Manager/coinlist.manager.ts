import { Injectable, Logger } from "@nestjs/common";
import { CreateCoinRequest } from "src/Common/ReqRspParam/CreateCoinRequst";
import { SearchCoinRequest } from "src/Common/ReqRspParam/SearchCoinRequest";
import CoinList from "src/Model/coinlist.model";

@Injectable()
export class CoinListManager {

    public logger = new Logger(CoinListManager.name);

    constructor() { }

    async existCoin(coinAddress: string) {
        this.logger.log("existCoin:", coinAddress);
        return await CoinList.findOne({ where: { contractAddress: coinAddress } });
    }

    async createCoin(createCoin: CreateCoinRequest) {
        this.logger.log("createCoin:", JSON.stringify(createCoin));
        const coin = await this.existCoin(createCoin.contractAddress)
        if (!coin) {
            const newCoin = new CoinList();
            newCoin.creatorUserId = createCoin.creatorUserId;
            newCoin.coinName = createCoin.coinName;
            newCoin.coinSymbol = createCoin.coinSymbol;
            newCoin.coinIntro = createCoin.coinIntro;
            newCoin.coinImage = createCoin.coinImage;
            newCoin.recommendReward = createCoin.recommendReward;
            newCoin.totalRecommendReward = createCoin.totalRecommendReward;
            newCoin.personalRecommendReward = createCoin.personalRecommendReward;
            newCoin.contractAddress = createCoin.contractAddress;
            newCoin.createHash = createCoin.createHash;
            newCoin.twitterLink = createCoin.twitterLink;
            newCoin.telegramLink = createCoin.telegramLink;
            newCoin.websiteLink = createCoin.websiteLink;
            await newCoin.save();
        } else {
            return "Coin already exists";
        }
    }


    async getCoinList(search: SearchCoinRequest) {
        const { pagination, sort } = search;

        // 构建分页参数
        const page = pagination.page || 1;
        const pageSize = pagination.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        this.logger.log("getCoinList:", JSON.stringify(search));
        return await CoinList.findAll({offset, limit, order: [['createdAt', 'DESC']]});
    }

    async getCoinListForMe(search: SearchCoinRequest) {
        const { pagination, sort } = search;

        // 构建分页参数
        const page = pagination.page || 1;
        const pageSize = pagination.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        this.logger.log("getCoinListForMe:", JSON.stringify(search));
        return await CoinList.findAll({ where: { creatorUserId: search.userId }, offset, limit, order: [['createdAt', 'DESC']]});
    }
}