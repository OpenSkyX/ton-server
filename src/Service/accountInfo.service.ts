import { Injectable } from "@nestjs/common";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { UpdateBioRequest } from "../Common/ReqRspParam/updateBioRequest";
import { GetFollowerRequest } from "../Common/ReqRspParam/GetFollowerRequest";

@Injectable()
export class AccountInfoService {
  constructor(private readonly accountInfoManager: AccountInfoManager) {}

  async updateBio(body: UpdateBioRequest) {
    
    return this.accountInfoManager.updateBio(body);
  }

  async getFollowerMe(body: GetFollowerRequest) {
    return await this.accountInfoManager.getFollowerMe(body);
  }

  async getFollower(body: GetFollowerRequest) {
    return await this.accountInfoManager.getFollower(body);
  }

  async inviteList(userId: string){
    return await this.accountInfoManager.inviteList(userId);
  }

  

  
}
