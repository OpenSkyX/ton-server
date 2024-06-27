import { Body, Controller, Post } from "@nestjs/common";
import { FollowerRequest } from "src/Common/ReqRspParam/followerRequest";
import Follower from "src/Model/follower.model";
import { FollowerService } from "src/Service/follower.service";

@Controller("follower")
export class FollowerController{


    constructor(private followerService:FollowerService){}


    /**
     * 
     * @param followerRequest 
     * @returns 
     */

    @Post("trigger")
    async followOfUnFollow(@Body() followerRequest:FollowerRequest){
        return await this.followerService.followOfUnFollow(followerRequest);
    }

    
}
