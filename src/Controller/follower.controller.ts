import { Body, Controller, Post } from "@nestjs/common";
import { FollowerRequest } from "../Common/ReqRspParam/followerRequest";
import Follower from "../Model/follower.model";
import { FollowerService } from "../Service/follower.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Follower")
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
