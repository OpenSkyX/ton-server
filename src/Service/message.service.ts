import { Injectable } from "@nestjs/common";
import { MessageRequest } from "src/Common/ReqRspParam/MessageReqeust";
import { MessageManager } from "src/Manager/message.manager";

@Injectable()
export class MessageService{

    constructor(private messageManager:MessageManager) {}

    //发送消息
    async postMessage(params: any) {
        return this.messageManager.postMessage(params);
    }

    //消息列表
    async messageList(body: MessageRequest) {
        return this.messageManager.messageList(body);
    }

    //更新已读状态
    async updateStatus(body: MessageRequest) {
        return this.messageManager.updateStatus(body);
    }

    //是否有未读消息
    async hasUnreadMessage(userId: number) {
        return this.messageManager.hasUnreadMessage(userId);
    }

    
}