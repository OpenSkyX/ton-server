import { Injectable } from "@nestjs/common";
import { CommentRequest } from "src/Common/ReqRspParam/CommentRequest";
import { GetCommentrequest } from "src/Common/ReqRspParam/GetCommentRequest";
import { TraderCommentRequest } from "src/Common/ReqRspParam/TraderCommentRequest";
import { CommentManager } from "src/Manager/comment.manager";

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