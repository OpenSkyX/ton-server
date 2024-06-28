import { Body,  Controller,  Get,  Logger,  Param,  Post, Query, UsePipes } from "@nestjs/common";
import { LikeRequest } from "../Common/ReqRspParam/LikeRequest";
import { LikeService } from "../Service/like.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("like")
@Controller("like")
export class LikeController{

    private logger = new Logger("LikeController");

    constructor(private service:LikeService){}

    @Post("trigger")
    async like(@Body() like:LikeRequest){
        return this.service.like(like);
    }

    @Get("byuser/:userId")
    async getLikeByUser(@Param("userId") userId:string){
        return (await (this.service.findLikeByUser(BigInt(userId)))).count; 
    }

    @Get("byComment/:commentId")
    async getLikeByComment(@Param("commentId") commentId:string){
        
        return (await (this.service.findLikeByComment(BigInt(commentId)))).count; 
    }

}