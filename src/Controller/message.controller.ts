import { Controller, Get, Query } from "@nestjs/common";
import { MessageRequest } from "src/Common/ReqRspParam/MessageReqeust";
import { ErrorHandler } from "src/Common/Response/ErrorHandler";
import { MessageService } from "src/Service/message.service";

@Controller('msg')
export class MessageController{


    constructor(public service:MessageService) {}


    //消息列表
    @Get('messageList')
    async messageList(@Query() body: MessageRequest) {
        return this.service.messageList(body).catch(ErrorHandler.handlerError);;
    }

    //已读
    @Get('updateStatus')
    async updateStatus(@Query()  body: MessageRequest) {
        return this.service.updateStatus(body).catch(ErrorHandler.handlerError);;
    }

    //查询是否有未读消息
    @Get('hasUnreadMessage')
    async hasUnreadMessage(@Query('userId') userId: number) {
        return this.service.hasUnreadMessage(userId).catch(ErrorHandler.handlerError);;
    }



}