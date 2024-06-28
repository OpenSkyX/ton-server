import { Injectable } from "@nestjs/common";
import { CommentRequest } from "../Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "../Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "../Common/ReqRspParam/TraderCommentRequest";
import { CommentManager } from "../Manager/comment.manager";

@Injectable()
export class CommentService {
  constructor(private readonly commentManager: CommentManager) {}

  async postComment(params: CommentRequest) {
    this.commentManager.postComment(params);
  }

  async trader(params: TraderCommentRequest) {
    this.commentManager.trader(params);
  }


  async commentList(body:GetCommentrequest) {
    return this.commentManager.commentList(body);
  }

  

}