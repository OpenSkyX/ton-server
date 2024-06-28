import { Injectable, Logger } from "@nestjs/common";
import { LikeRequest } from "../Common/ReqRspParam/LikeRequest";
import { LikeManager } from "../Manager/like.manager";
import Like from "../Model/like.model";

@Injectable()
export class LikeService{
    constructor(private likeManager:LikeManager){}
    private readonly logger = new Logger('LikeService');

    async like(likeRequest:LikeRequest): Promise<Like> {
        const like = await this.likeManager.queryExist(likeRequest);
        if (like) {
            this.likeManager.unLike(likeRequest);
            return null;
        }
        return this.likeManager.like(likeRequest);
    }


    async findLikeByUser(userId:bigint){
        return await Like.findAndCountAll({
            where:{
                userId:userId
            }
        })
    }

    async findLikeByComment(commentId:bigint){
        return await Like.findAndCountAll({
            where:{
                commentId:commentId
            }
        })
    }
}