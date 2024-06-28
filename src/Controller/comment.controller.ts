import { Body, Controller, Post,Get, Query } from "@nestjs/common";
import { CommentRequest } from "../Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "../Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "../Common/ReqRspParam/TraderCommentRequest";
import { ErrorHandler } from "../Common/Response/ErrorHandler";
import { CommentService } from "../Service/comment.service";
import { broadcastMessage, startWssServer } from "../wss/WssServer";

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

    @Post("trader")
    trader(@Body() params: TraderCommentRequest){
        broadcastMessage(JSON.stringify(params));
        return this.commentService.trader(params).catch(ErrorHandler.handlerError);
          
    }


}