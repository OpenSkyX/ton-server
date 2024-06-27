import { Injectable } from "@nestjs/common";
import { CommonUtils } from "../Common/Utils/CommonUtils";
import AccountInfo from "../Model/accountInfo.model";
import { AccountDetailRsp } from "../Common/ReqRspParam/AccountDetailRsp";
const { ethers } = require("ethers");
import { IStorage } from '@tonconnect/sdk';
import Like from "src/Model/like.model";
import Follower from "src/Model/follower.model";
import Comment from "src/Model/comment.model";
import { UpdateBioRequest } from "src/Common/ReqRspParam/updateBioRequest";
import { GetFollowerRequest } from "src/Common/ReqRspParam/GetFollowerRequest";

@Injectable()
export class AccountInfoManager implements IStorage {

  //private readonly chatId: number
  constructor() { }

  //要求token的id
  async requireIdIsExist(acccountId: number) {
    let accountRow = await AccountInfo.findOne({ where: { id: acccountId } });
    if (!accountRow) throw new Error(`acccountId[${acccountId}] is invalid`);
    return accountRow;
  }

  async getAccountDetailUserId(userId: bigint): Promise<AccountInfo> {
    let accountRow = await AccountInfo.findOne({ where: { id: userId } });
    const likes: any = await Like.count({ where: { commentOwnerUserId: accountRow.id } });
    accountRow.setDataValue('likes', likes); // 设置点赞数到评论对象中

    const followers: any = await Follower.count({ where: { followerUserId: accountRow.id } });
    accountRow.setDataValue('followers', followers); // 设置点赞数到评论对象中

    const replys: any = await Comment.count({ where: { commentOwnerUserId: accountRow.id } });
    accountRow.setDataValue('replys', replys); // 设置点赞数到评论对象中
    return accountRow;
  }


  async getAccountDetailByAddress(address: string): Promise<AccountInfo> {
    let accountRow = await AccountInfo.findOne({ where: { address: address } });
    if (accountRow) {
      const likes: any = await Like.count({ where: { commentOwnerUserId: accountRow.id } });
      accountRow.setDataValue('likes', likes); // 设置点赞数到评论对象中
      const followers: any = await Follower.count({ where: { followerUserId: accountRow.id } });
      accountRow.setDataValue('followers', followers); // 设置点赞数到评论对象中

      const replys: any = await Comment.count({ where: { commentOwnerUserId: accountRow.id } });
      accountRow.setDataValue('replys', replys); // 设置点赞数到评论对象中
    }

    return accountRow;
  }

  async fundAllAccount(): Promise<AccountInfo[]> {
    let accountRows = await AccountInfo.findAll();
    return accountRows;
  }

  async saveAccountDetail(accountDetail: AccountInfo): Promise<void> {
    CommonUtils.logDebug("saveAccountDetail:" + JSON.stringify(accountDetail));
    let account: AccountInfo = await AccountInfo.findOne({ where: { telegramUserId: accountDetail.telegramUserId } });
    if (!account) {
      account = new AccountInfo();
      account.address = accountDetail.address;
      account.telegramUserId = accountDetail.telegramUserId;
      account.username = accountDetail.username;
      account.avatar = accountDetail.avatar;
      account.slfeCode = accountDetail.slfeCode;
      account.inviterId = accountDetail.inviterId;
      await account.save();
    }
  }

  async updateBio(accountDetail: UpdateBioRequest){
    let account: AccountInfo = await AccountInfo.findOne({ where: { address: accountDetail.address } });
    if (account) {
      account.bio = accountDetail.bio;
      await account.save();
    }
    return "success"
  }

  async getFollowerMe(body: GetFollowerRequest) {
    const offset = (body.pageNumber - 1) * body.pageSize;
    //根据钱包地址查询用户ID
    const user = await AccountInfo.findOne({ where: { address: body.address } });
    if (!user) {
      return "user not found";
    }
    //  , offset: offset, limit: body.pageSize
    const followers = await Follower.findAll({ where: { followerUserId: user.id } });
    const accounts: AccountInfo[] = [];
    if(followers) {
      await Promise.all(
        followers.map(async (comment) => {
          await accounts.push(await this.getAccountDetailUserId(comment.userId));
        })
      );
    }
    return accounts;
  }

  async getFollower(body: GetFollowerRequest){
    const offset = (body.pageNumber - 1) * body.pageSize;
    //根据钱包地址查询用户ID
    const user = await AccountInfo.findOne({ where: { address: body.address } });
    if (!user) {
      return "user not found";
    }

    const followers = await Follower.findAll({ where: { userId: user.id } });
    const accounts: AccountInfo[] = [];
    if(followers) {
      await Promise.all(
        followers.map(async (comment) => {
          await accounts.push(await this.getAccountDetailUserId(comment.followerUserId));
        })
      );
    }
    return accounts;
  }

  private getKey(key: string): string {
    return "tonconnect:" + key;
  }

  async removeItem(key: string): Promise<void> {
    await "delete:" + key;
  }

  async setItem(key: string, value: string): Promise<void> {
    await "";
  }

  async getItem(key: string): Promise<string | null> {
    return "";
  }


}
