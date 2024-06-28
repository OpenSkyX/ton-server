import { Injectable, Logger } from "@nestjs/common";
import { CreateCoinRequest } from "../Common/ReqRspParam/CreateCoinRequst";
import { SearchCoinRequest } from "../Common/ReqRspParam/SearchCoinRequest";
import CoinList from "../Model/coinlist.model";
import { Op, or } from "sequelize";
import AccountInfo from "src/Model/accountInfo.model";
import Comment from "src/Model/comment.model";

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

        // 构建分页参数
        const page = search.pageNumber || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        this.logger.log("getCoinList:", JSON.stringify(search));
        const totalCount = await CoinList.count()

        let data = await CoinList.findAll(
            {
                offset, limit, order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: AccountInfo,
                        attributes: ['firstName', 'lastName', 'address'],
                    }
                ]
            })
        if (data) {
            await Promise.all(
                data.map(async (coinList) => {
                    const repliesCount = await Comment.count({ where: { contract: coinList.contractAddress } });
                    coinList.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
                })
            );
        }
        return {
            total: totalCount, data: data
        };
    }

    async getCoinListForMe(search: SearchCoinRequest) {

        // 构建分页参数
        const page = search.pageNumber || 1;
        const pageSize = search.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        this.logger.log("getCoinListForMe:", JSON.stringify(search));
        //查询行数
        const totalCount = await CoinList.count({ where: { creatorUserId: search.userId } })
        let data = await CoinList.findAll({
            where: { creatorUserId: search.userId },
            offset, limit, order: [['createdAt', 'DESC']],
            include: [
                { model: AccountInfo, attributes: ['firstName', 'lastName', 'address'], }
            ]
        })
        if (data) {
            await Promise.all(
                data.map(async (coinList) => {
                    const repliesCount = await Comment.count({ where: { contract: coinList.contractAddress } });
                    coinList.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
                })
            );
        }
        return {
            total: totalCount, data: data
        };
    }


    async searchToken(search: SearchCoinRequest) {
        let where = {};
        if (search.contract) {
            where = { contractAddress: search.contract }
        }
        if (search.name) {
            where = {
                [Op.or]: [
                    {
                        coinSymbol: {
                            [Op.like]: `%${search.name}%`
                        }
    
                    },{
                        coinName: {
                            [Op.like]: `%${search.name}%`
                        }
                    }
                ]
            }

        }

        // 构建分页参数
        const page = search.pageNumber || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const totalCount = await CoinList.count({ where })

        let data = await CoinList.findAll({
            where, offset, limit,
            include: [
                { model: AccountInfo, attributes: ['firstName', 'lastName', 'address'], }
            ]
        })

        if (data) {
            await Promise.all(
                data.map(async (coinList) => {
                    const repliesCount = await Comment.count({ where: { contract: coinList.contractAddress } });
                    coinList.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
                })
            );
        }

        return { total: totalCount, data: data }
    }
}