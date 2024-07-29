import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CommentRequest } from "../Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "../Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "../Common/ReqRspParam/TraderCommentRequest";
import Comment from "../Model/comment.model";
import Like from "../Model/like.model";
import Message from "../Model/message.model";
import AccountInfo from "../Model/accountInfo.model";
import { timestamp } from "rxjs";

@Injectable()
export class CommentManager {

    constructor(@InjectModel(Comment)
    private commentModel: typeof Comment) { }

    async postComment(params: CommentRequest) {
        const comment = await this.commentModel.create({
            userId: params.userId,
            content: params.content,
            contract: params.contract,
            parentId: params.parentId,
            image: params.image
        })
        console.log(`新评论：${comment.id}`)
        
        //发送评论消息
        if (params.toUserId) {
            Message.create({
                sender: params.userId,
                receiver: params.toUserId,
                type: 1,
                content: params.content,
                status: 0,
                parentId: params.parentId,
                token: params.contract,
                commentId: params.parentId,
                image: params.image,
            
            })
        }
        return
    }

    async trader(params: TraderCommentRequest) {
        // KLine.create({
        //     price:params.price,
        //     timestamp:Date.now()
        // })
        return this.commentModel.create({
            userId: params.userId,
            content: params.content,
            contract: params.contract,
            direction: params.direction,
            amount: params.amount,
            hash: params.hash,
            baseToken: params.baseToken
        })
    }


    async commentList(body: GetCommentrequest) {
        const offset = (body.pageNumber - 1) * body.pageSize;
        const comments = await this.commentModel.findAll({
            where: { contract: body.contract },
            include: [
                { model: Like, as: 'likes', attributes: ['userId'] },
                { model: AccountInfo, attributes: ['firstName', 'lastName', 'address', 'avatar'], }],
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: parseInt(body.pageSize.toString()),

        });
        const totalCount = await this.commentModel.count({ where: { contract: body.contract } })

        // 使用 Promise.all() 并行查询每条评论的点赞数
        await Promise.all(
            comments.map(async (comment) => {
                const isLiked = comment.likes.some(like => {
                    if (like.userId == body.userId) {
                        return true
                    }
                })

                const likeCount = await Like.count({ where: { commentId: comment.id } });
                comment.setDataValue('likeCount', likeCount); // 设置点赞数到评论对象中
                comment.setDataValue('isLiked', isLiked);
            })
        );
        return { total: totalCount, data: comments };
    }

}