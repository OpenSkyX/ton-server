import { Injectable } from "@nestjs/common";
import { FollowerManager } from "src/Manager/follower.manager";

@Injectable()
export class FollowerService{

    constructor(private followerManager:FollowerManager){}

    async followOfUnFollow(followerRequest:any):Promise<Object>{
        return await this.followerManager.followOfUnFollow(followerRequest);
    }

}