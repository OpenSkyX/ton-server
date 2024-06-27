import { PageBaseReq } from "./PageBaseReq";

export class AccountDetailRsp {
  selfddress    : string; //用户钱包地址
  telegramUserId: number; //telegram用户ID
  username      : string; //用户名
  avatar        : string; //头像地址
  slfeCode      : string; //自己的邀请地址
  inviterId     : number; //邀请者ID
  firstName     : string; //tg first name
  lastName      : string; //tg last name
}
