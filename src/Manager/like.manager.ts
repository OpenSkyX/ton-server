import { Inject, Injectable } from "@nestjs/common";
import { LikeRequest } from "src/Common/ReqRspParam/LikeRequest";
import Like from "src/Model/like.model";
import Message from "src/Model/message.model";

@Injectable()
export class LikeManager {

    constructor() { }

    async queryExist(likeRequest: LikeRequest): Promise<Like> {
        return Like.findOne({
            where: {
                userId: likeRequest.userId,
                commentOwnerUserId: likeRequest.commentOwnerUserId,
                commentId: likeRequest.commentId
            }
        })
    }

    async like(likeRequest: LikeRequest): Promise<Like> {
        //发送消息
        Message.create({
            sender: likeRequest.userId,
            receiver: likeRequest.commentOwnerUserId,
            type: 2,
            content: null,
            status: 0,
            commentId: likeRequest.commentId,
            token:likeRequest.token
        })
        return Like.create({
            userId: likeRequest.userId,
            commentOwnerUserId: likeRequest.commentOwnerUserId,
            commentId: likeRequest.commentId
        });
    }

    async unLike(likeRequest: LikeRequest): Promise<void> {
        //删除消息
        Message.destroy({
            where: {
                sender: likeRequest.userId,
                receiver: likeRequest.commentOwnerUserId,
                type: 2,
                commentId: likeRequest.commentId
            }
        })

        await Like.destroy({
            where: {
                userId: likeRequest.userId,
                commentOwnerUserId: likeRequest.commentOwnerUserId,
                commentId: likeRequest.commentId
            }
        });
    }
}