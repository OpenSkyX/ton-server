import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { FollowerRequest } from "../Common/ReqRspParam/followerRequest";
import Follower from "../Model/follower.model";
import { FollowerService } from "../Service/follower.service";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { SearchbyUserId } from "../Common/ReqRspParam/SearchbyUserId";
import { ErrorHandler } from "../Common/Response/ErrorHandler";

@ApiTags("Follower")
@Controller("follower")
export class FollowerController{


    constructor(private followerService:FollowerService){}

    /**
     * 
     * @param followerRequest 
     * @returns 
     */

    
    /**
     * 关注和取消关注
     * @param followerRequest 
     * @returns 
     */
    @Post("trigger")
    async followOfUnFollow(@Body() followerRequest:FollowerRequest){
        return await this.followerService.followOfUnFollow(followerRequest).catch(ErrorHandler.handlerError);
    }

    /**
     *  查询关注的人交易列表
     * @param followerRequest 
     * @returns 
     */
    @Get("traderInfo")
    async traderInfo(@Query() body:SearchbyUserId){
        return await this.followerService.traderInfo(body).catch(ErrorHandler.handlerError);
    }
    

    /**
     * 查询是否关注
     * @param body 
     * @returns 
     */
    @Get("isFollower/:current/:from")
    async isFollower(@Param("current") current:string, @Param("from")from:string){
        return await this.followerService.isFollower(current,from).catch(ErrorHandler.handlerError);
    }

    @Get("recommend/:current")
    async recommend(@Param("current") current:string){
        return await this.followerService.recommend(current).catch(ErrorHandler.handlerError);
    }

    
}
