import { Injectable, Logger } from "@nestjs/common";
import { CreateCoinRequest } from "../Common/ReqRspParam/CreateCoinRequst";
import { SearchCoinRequest, SearchCoinForMeRequest } from "../Common/ReqRspParam/SearchCoinRequest";
import CoinList from "../Model/coinlist.model";
import { Op, QueryTypes, col, fn, literal, or } from "sequelize";
import AccountInfo from "../Model/accountInfo.model";
import Comment from "../Model/comment.model";
import Transaction from "../Model/transaction.model";
import { sequelize } from "../Model/db";


@Injectable()
export class CoinListManager {

    public logger = new Logger(CoinListManager.name);

    constructor() { }

    async existCoin(coinAddress: string) {
        this.logger.log("existCoin:", coinAddress);
        return await CoinList.findOne({ where: { contractAddress: coinAddress } });
    }

    /**
     * 
     * @param createCoin 创建代币
     * @returns 
     */
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
            newCoin.rewardType = createCoin.rewardType;
            newCoin.rewardValue = createCoin.rewardValue;
            newCoin.percent = createCoin.percent;
            newCoin.recommendReward = createCoin.recommendReward;
            newCoin.totalRecommendReward = createCoin.totalRecommendReward;
            newCoin.personalRecommendReward = createCoin.personalRecommendReward;
            newCoin.contractAddress = createCoin.contractAddress;
            newCoin.createHash = createCoin.createHash;
            newCoin.twitterLink = createCoin.twitterLink;
            newCoin.telegramLink = createCoin.telegramLink;
            newCoin.websiteLink = createCoin.websiteLink;
            newCoin.status = "1";
            await newCoin.save();
        } else {
            return "Coin already exists";
        }
    }


    /**
     *  获取代币列表
     * @param search 
     * @returns 
     */
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
                        attributes: ['firstName', 'lastName', 'avatar', 'address'],
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


    /**
     * 根据市值排序
     * @param search 
     * @returns 
     */
    async getCoinListByMarketCap(search: SearchCoinRequest) {
        // 构建分页参数
        const page = search.pageNumber || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const totalCount = await CoinList.count()
        let data = await CoinList.findAll(
            {
                offset, limit, order: [['tonReserve', search.sortOrder]],
                include: [
                    {
                        model: AccountInfo,
                        attributes: ['firstName', 'lastName', 'avatar', 'address'],
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


    /**
     * 根据回复数排序
     * @param search 
     * @returns 
     */
    async getCoinListByReplyCount(search: SearchCoinRequest) {
        let data = await this.getCoinListByMarketCap(search);

        if (search.sortOrder == 'ASC') {
            const newJSONDate = JSON.stringify(data.data);
            const d = JSON.parse(newJSONDate);
            const newData = d.sort((a, b) => a.replies - b.replies);
            return { total: data.total, data: newData };
        } else {
            const newJSONDate = JSON.stringify(data.data);
            const d = JSON.parse(newJSONDate);
            const newData = d.sort((a, b) => b.replies - a.replies);
            return { total: data.total, data: newData };
        }
        return null;
    }

    /**
     * 根据创建时间排序
     * @param search 
     * @returns 
     */
    async getCoinListByCreationTime(search: SearchCoinRequest) {
        const page = search.pageNumber || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const totalCount = await CoinList.count()

        let data = await CoinList.findAll(
            {
                offset, limit, order: [['createdAt', search.sortOrder]],
                include: [
                    {
                        model: AccountInfo,
                        attributes: ['firstName', 'lastName', 'avatar', 'address'],
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

    /**
     * 根据交易量排序
     * @param search 
     * @returns 
     */
    async getCoinListBy24Volume(search: SearchCoinRequest) {
        const page = search.pageNumber || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const totalCount = await CoinList.count()

        const tx = await Transaction.findAll({
            attributes: [
                'token',
                [fn('SUM', col('ton')), 'totalVolume']
            ],
            group: ['token'],
            order: [[literal('totalVolume'), search.sortOrder]]
        })
        const conlist = await CoinList.findAll({
            include: [
                {
                    model: AccountInfo,
                    attributes: ['firstName', 'lastName', 'avatar', 'address'],
                }
            ]
        });
        if (conlist) {
            await Promise.all(
                conlist.map(async (coin) => {
                    const repliesCount = await Comment.count({ where: { contract: coin.contractAddress } });
                    coin.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
                })
            );
        }
        const sortedArray = this.sortArrayByOrder(conlist, tx);

        return { total: totalCount, data: this.paginateArray(sortedArray, page, pageSize) };

    }

    /**
     * 根据最新回复排序
     * @param search 
     */
    async getCoinListbyLastReply(search: SearchCoinRequest) {
        const page = search.pageNumber || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const totalCount = await CoinList.count()
        const latestComments = await sequelize.query(
            `SELECT t1.contract as token
            FROM comment_info t1
            INNER JOIN (
                SELECT contract, MAX(created_at) as latest
                FROM comment_info
                GROUP BY contract
            ) t2
            ON t1.contract = t2.contract AND t1.created_at = t2.latest
            ORDER BY t1.created_at ${search.sortOrder}
            `,
            {
                model: Comment,
                mapToModel: true,
                type: QueryTypes.SELECT,
            }
        );

        const conlist = await CoinList.findAll({
            include: [
                {
                    model: AccountInfo,
                    attributes: ['firstName', 'lastName', 'avatar', 'address'],
                }
            ]
        });
        if (conlist) {
            await Promise.all(
                conlist.map(async (coin) => {
                    const repliesCount = await Comment.count({ where: { contract: coin.contractAddress } });
                    coin.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
                })
            );
        }
        const sortedArray = this.sortArrayByOrder(conlist, latestComments);

        return { total: totalCount, data: sortedArray }

    }

    /**
     *  用户发行代币列表
     * @param search 用户发行代币列表
     * @returns 
     */
    async getCoinListForMe(search: SearchCoinForMeRequest) {

        // 构建分页参数
        const page = parseInt(search.pageNumber.toString()) || 1;
        const pageSize = parseInt(search.pageSize.toString()) || 10;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        this.logger.log("getCoinListForMe:", JSON.stringify(search));
        //查询行数
        const totalCount = await CoinList.count({ where: { creatorUserId: search.userId } })
        let data = await CoinList.findAll({
            where: { creatorUserId: search.userId },
            offset, limit, order: [['createdAt', 'DESC']],
            include: [
                { model: AccountInfo, attributes: ['firstName', 'avatar', 'lastName', 'address'], }
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

    /**
     * 获取山丘之王
     */
    async KingOfTheHill() {
        let data: any = await CoinList.findOne({
            where: {
                kingOfMountain: "1"
            },
            include: [
                { model: AccountInfo, attributes: ['firstName', 'avatar', 'lastName', 'address'], }
            ],
            order: [['updatedAt', 'DESC']],
        })

        if (data) {
            const repliesCount = await Comment.count({ where: { contract: data.contractAddress } });
            data.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
        } else {
            data = await CoinList.findOne({
                include: [
                    { model: AccountInfo, attributes: ['firstName', 'avatar', 'lastName', 'address'], }
                ],
                order: [['tonReserve', 'DESC']],
            })
            const repliesCount = await Comment.count({ where: { contract: data.contractAddress } });
            data.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
        }
        return { data: data };
    }

    /**
     *  搜索代币
     * @param search 根据合约地址和代币名称，简称检索代币列表
     * @returns 
     */
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

                    }, {
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


    /**
     *  获取代币详情
     * @param contract 
     * @returns 
     */
    async getCoinDetail(contract: string) {
        const coin = await CoinList.findOne({ where: { contractAddress: contract } })
        if (coin) {
            const repliesCount = await Comment.count({ where: { contract: coin.contractAddress } });
            coin.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
        }
        return coin;
    }


    async kLastPrice(contract: string) {
        const coin = await CoinList.findOne({ where: { contractAddress: contract } })
        if (coin) {
            const repliesCount = await Comment.count({ where: { contract: coin.contractAddress } });
            coin.setDataValue('replies', repliesCount); // 设置点赞数到评论对象中
        }
        return coin;
    }

    sortArrayByOrder(arr: any[], order: any[]): any[] {
        const orderMap = new Map(order.map((item, index) => [item.token, index]));

        return arr.sort((a, b) => {
            const indexA = orderMap.get(a.contractAddress);
            const indexB = orderMap.get(b.contractAddress);

            if (indexA !== undefined && indexB !== undefined) {
                return indexA - indexB;
            } else if (indexA !== undefined) {
                return -1;
            } else if (indexB !== undefined) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    paginateArray<T>(array: T[], page: number, pageSize: number): T[] {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return array.slice(start, end);
    }

}