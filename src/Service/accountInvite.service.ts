
import { Injectable } from "@nestjs/common";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { UpdateBioRequest } from "../Common/ReqRspParam/updateBioRequest";
import { GetFollowerRequest } from "../Common/ReqRspParam/GetFollowerRequest";

@Injectable()
export class AccoungInviteService {

    constructor(private readonly accountInfoManager: AccountInfoManager) {

    }

    



}