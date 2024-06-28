import { Injectable } from "@nestjs/common";
import { FollowerRequest } from "../Common/ReqRspParam/followerRequest";
import Follower from "../Model/follower.model";
import Message from "../Model/message.model";


@Injectable()
export class FollowerManager {

    constructor() { }

    /**
     * 
     * @param followerRequest 
     * @returns 
     */
    async followOfUnFollow(followerRequest: FollowerRequest): Promise<Object> {
        if (await this.queryExist(followerRequest)) {
            //取消关注
            Message.destroy({
                where: {
                    sender: followerRequest.userId,
                    receiver: followerRequest.followerUserId,
                    type: 3
                }
            })

            return await Follower.destroy({
                where: {
                    userId: followerRequest.userId,
                    followerUserId: followerRequest.followerUserId
                }
            })
        }
        //关注
        Message.create({
            sender: followerRequest.userId,
            receiver: followerRequest.followerUserId,
            type: 3,
            content: null,
            status: 0,
            commentId: null,
            token: null
        })
        Follower.create({
            userId: followerRequest.userId,
            followerUserId: followerRequest.followerUserId
        })
        return true;
    }


    /**
     * 
     * @param followerRequest 
     * @returns 
     */
    async queryExist(followerRequest: FollowerRequest): Promise<Object> {

        return await Follower.findOne({
            where: {
                userId: followerRequest.userId,
                followerUserId: followerRequest.followerUserId
            }
        })
    }

}