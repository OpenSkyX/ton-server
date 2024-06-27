import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CommentRequest } from "src/Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "src/Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "src/Common/ReqRspParam/TraderCommentRequest";
import Comment from "src/Model/comment.model";
import Like from "src/Model/like.model";
import Message from "src/Model/message.model";

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

        //发送评论消息
        if (params.toUserId) {
            Message.create({
                sender: params.userId,
                receiver: params.toUserId,
                type: 1,
                content: params.content,
                status: 0,
                commentId: params.parentId,
                token: params.contract
            })
        }
        return 
    }

    async trader(params: TraderCommentRequest) {
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
    

    async commentList(body:GetCommentrequest) {
        const offset = (body.pageNumber - 1) * body.pageSize;
        const comments = await this.commentModel.findAll({
            where: { contract: body.contract },
            include: [{ model: Like, as: 'likes' }],
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: parseInt(body.pageSize.toString())
        });

        // 使用 Promise.all() 并行查询每条评论的点赞数
        await Promise.all(
            comments.map(async (comment) => {
                const likeCount = await Like.count({ where: { commentId: comment.id } });
                comment.setDataValue('likeCount', likeCount); // 设置点赞数到评论对象中
            })
        );
        return comments;
    }

}