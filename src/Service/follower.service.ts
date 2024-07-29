import { Injectable } from "@nestjs/common";
import { FollowerManager } from "../Manager/follower.manager";
import { SearchbyUserId } from "../Common/ReqRspParam/SearchbyUserId";
import Follower from "../Model/follower.model";
import Transaction from "../Model/transaction.model";
import AccountInfo from "../Model/accountInfo.model";
import CoinList from "../Model/coinlist.model";

@Injectable()
export class FollowerService {

    constructor(private followerManager: FollowerManager) { }

    async followOfUnFollow(followerRequest: any): Promise<Object> {
        return await this.followerManager.followOfUnFollow(followerRequest);
    }

    async traderInfo(body: SearchbyUserId) {
        const offset = (body.pageNumber - 1) * body.pageSize;
        const limit = parseInt(body.pageSize.toString())
        let tx: Array<any>;
        const follower = await Follower.findAll({
            where: { followerUserId: body.userId },
            offset: offset,
            limit: limit,
            attributes: ['userId']
        });
        if (follower.length == 0) {
            return;
        }
        //创建一个空数组
        tx = [];
        let total = 0;
        await Promise.all(follower.map(async (follower) => {
            const count = await Transaction.count({
                where: {
                    userId: follower.userId,
                },
                attributes: ['userId']
            });
            total += count;
            const transaction: any[] = await Transaction.findAll({
                where: { userId: follower.userId },
                include: [
                    {
                        model: AccountInfo,
                        attributes: ['firstName', 'lastName', 'avatar']
                    },
                ],
                offset: offset,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });

            await Promise.all(transaction.map(async (tx) => {
                const coin = await CoinList.findOne({
                    where: {
                        contractAddress: tx.token
                    },
                    attributes: ['coinName', 'coinSymbol', 'coinImage', 'coinIntro']
                })
                tx.setDataValue('coin', coin)
            }))

            if (transaction.length != 0) {
                await transaction.forEach(async (transaction) => {
                    tx.push(transaction);
                })

            }

        }));
        return { data: tx, total: total };
    }


    /**
     * 判断当前用户是否被from用户关注
     * @param currentUserId  当前用户
     * @param fromUserId     from用户
     */
    async isFollower(currentUserId: string, fromUserId: string) {
        const isFollower = await Follower.findOne({
            where: {
                userId: parseInt(fromUserId),
                followerUserId: parseInt(currentUserId)
            }
        })
        if (isFollower) {
            return true;
        }
        return false;
    }


    async recommend(currentUserId: string) {
        let userIds = [];
        //查询所有关注当前用户的用户
        const follower = await Follower.findAll({
            where: {
                followerUserId: parseInt(currentUserId)
            },
            attributes: ['userId']
        })
        //查询当前用户关注的用户
        const followerUsers: any = Follower.findAll({
            where: {
                userId: parseInt(currentUserId)
            }
        });

        //查询当前用户所有关注用户的关注用户
        if (followerUsers.length > 0) {
            await Promise.all(followerUsers.map(async (follower) => {
                const ids = await Follower.findAll({
                    where: {
                        userId: follower.userId
                    },
                    attributes: ['followerUserId']
                })
                
                userIds.push(...ids.map(follower => follower.userId))

            }))
        }
        userIds.push(...follower.map(follower => follower.userId))

        let accountInfo = [];
        if (userIds.length > 3) {
            //如果大于3个则随机取3个    
            userIds = userIds.sort(() => Math.random() - 0.5).slice(0, 3);
            await Promise.all(userIds.map(async (userId) => {
                const infos: any = await AccountInfo.findOne({
                    where: {
                        id: userId
                    }
                })
                const followers: any = await Follower.count({ where: { followerUserId: infos.id } });
                infos.setDataValue('followers', followers); // 设置点赞数到评论对象中
                accountInfo.push(infos)
            }))

        } else {
            await Promise.all(userIds.map(async (userId) => {
                const infos: any = await AccountInfo.findOne({
                    where: {
                        id: userId
                    }
                })
                const followers: any = await Follower.count({ where: { followerUserId: infos.id } });
                infos.setDataValue('followers', followers); // 设置点赞数到评论对象中
                accountInfo.push(infos)
            }))

        }

        return accountInfo;
    }







}