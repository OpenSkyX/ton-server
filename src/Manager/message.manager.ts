import { Injectable } from "@nestjs/common";
import { MessageRequest } from "../Common/ReqRspParam/MessageReqeust";
import AccountInfo from "../Model/accountInfo.model";
import Comment from "../Model/comment.model";
import Message from "../Model/message.model";

@Injectable()
export class MessageManager {

    constructor() {}

    //发送消息
    async postMessage(params: any) {
        return "postMessage";
    }

    //消息列表
    async messageList(body: MessageRequest) {
        //分页
        const OFFSET = (body.pageNumber - 1) * body.pageSize
        const user = await AccountInfo.findOne({
            where: {
                id: body.userId
            }
        })
        if (!user) {
            return [];
        }
        
        const data = await Message.findAll({
            where: {
                receiver: body.userId
            },
            offset: OFFSET,
            limit: parseInt(body.pageSize.toString()),
            include: [{ model: Comment, as: 'comment' }]
        });
        
        return data;
    }

    //更新已读状态
    async updateStatus(body: MessageRequest) {
        return await Message.update({
            status: 1
        }, {
            where: {
                receiver: body.userId
            }
        })
    }

    //查询是否有未读消息
    async hasUnreadMessage(userId: number) {
        const data = await Message.findOne({
            where: {
                receiver: userId,
                status: 0
            }
        });
        return data;
    }


}