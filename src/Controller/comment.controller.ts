import { Body, Controller, Post,Get, Query } from "@nestjs/common";
import { CommentRequest } from "src/Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "src/Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "src/Common/ReqRspParam/TraderCommentRequest";
import { ErrorHandler } from "src/Common/Response/ErrorHandler";
import { CommentService } from "src/Service/comment.service";
import { broadcastMessage, startWssServer } from "src/wss/WssServer";

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