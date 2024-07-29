import { Body, Controller, Post,Get, Query } from "@nestjs/common";
import { CommentRequest } from "../Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "../Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "../Common/ReqRspParam/TraderCommentRequest";
import { ErrorHandler } from "../Common/Response/ErrorHandler";
import { CommentService } from "../Service/comment.service";
import { broadcastMessage, startWssServer } from "../wss/WssServer";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { SearchbyUserId } from "../Common/ReqRspParam/SearchbyUserId";
import AccountInfo from "../Model/accountInfo.model";

@ApiTags("comment")
@Controller("comment")
export  class CommentController{

    constructor(private commentService :CommentService) {}

    @Post("postComment")
    postComment(@Body() params: CommentRequest){
        
        return this.commentService.postComment(params).catch(ErrorHandler.handlerError);
    }

    @Get("commentList")
    commentList(@Query() body : GetCommentrequest){
        return this.commentService.commentList(body).catch(ErrorHandler.handlerError);
    }

    @Get("replies")
    getTraderComment(@Query() body:SearchbyUserId){
        return this.commentService.getReplies(body).catch(ErrorHandler.handlerError);
    }
    

    @Post("trader")
    async trader(@Body() params: TraderCommentRequest){
        const user = await AccountInfo.findOne({where :{id:params.userId}})
        if(!user){
            return ErrorHandler.handlerError("user not found")
        }
        const messageBody = {
            title:"comment",
            accountInfo:user,
            trader:params
        }
        broadcastMessage(JSON.stringify(messageBody));
        return this.commentService.trader(params).catch(ErrorHandler.handlerError);
    }


}