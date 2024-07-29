import { Injectable } from "@nestjs/common";
import { CommentRequest } from "../Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "../Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "../Common/ReqRspParam/TraderCommentRequest";
import { CommentManager } from "../Manager/comment.manager";
import Comment from "../Model/comment.model";
import { SearchbyUserId } from "../Common/ReqRspParam/SearchbyUserId";
import AccountInfo from "../Model/accountInfo.model";
import Like from "../Model/like.model";

@Injectable()
export class CommentService {
  constructor(private readonly commentManager: CommentManager) { }

  async postComment(params: CommentRequest) {
    this.commentManager.postComment(params);
  }

  async trader(params: TraderCommentRequest) {
    this.commentManager.trader(params);
  }


  async commentList(body: GetCommentrequest) {
    return this.commentManager.commentList(body);
  }

  async getReplies(body: SearchbyUserId) {
    const userId = parseInt(body.userId.toString())
    const offset = (body.pageNumber - 1) * body.pageSize;
    const limit = parseInt(body.pageSize.toString())
    const total = await Comment.count({ where: { userId: userId} });
    const data = await Comment.findAll({
      where: { userId: userId },
      include: [{ model: AccountInfo ,attributes: ['firstName',"lastName","username","address","avatar"] }],
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    })

    await Promise.all(data.map(async (item) => {
      const likeCount = await Like.count({where:{commentId:item.id}})
      item.setDataValue('likeCount', likeCount);
    }))

    return { total: total, data: data };
  }



}