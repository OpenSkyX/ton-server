import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { CommonUtils } from "../Common/Utils/CommonUtils";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { DecimalProperties } from "../Common/DecimalProperties";
import AccountInfo from "../Model/accountInfo.model";
import { UpdateBioRequest } from "src/Common/ReqRspParam/updateBioRequest";
import { GetFollowerRequest } from "src/Common/ReqRspParam/GetFollowerRequest";

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

  

  
}
