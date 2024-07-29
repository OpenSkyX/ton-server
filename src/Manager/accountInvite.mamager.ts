import { Injectable } from "@nestjs/common";
import AccountInvite from "../Model/accountInvite.model";

@Injectable()
export class AccountInviteManager {

    constructor() { }

    //验证绑定关系
    async verifyRelation(accountInvite: AccountInvite) {
        const data = await AccountInvite.findOne({
            where: {
                currentTgId: accountInvite.currentTgId,
                tokenAddress: accountInvite.tokenAddress
            }
        })

        return data ? true : false
    }

    //绑定关系
    async bindRelation(accountInvite: AccountInvite) {
        if (await this.verifyRelation(accountInvite)) {
            return "Relationship already exists"
        } else {
            await AccountInvite.create({
                currentTgId: accountInvite.currentTgId,
                tokenAddress: accountInvite.tokenAddress
            })
            return true
        }
    }


    /**
     * 查询邀请过多少用户
     * @param accountInvite 
     */
    async queryBind(accountInvite: AccountInvite) {
        return await AccountInvite.findAll({
            where: {
                inviteTgId: accountInvite.inviteTgId
            }
        })
    }

    /**
     * 查询用户在某个代币上邀请过多少用户
     * @param accountInvite 
     */
    //查询邀请列表
    async queryInviteList(accountInvite: AccountInvite) {
        return await AccountInvite.findAll({
            where: {
                tokenAddress: accountInvite.tokenAddress
            }
        })
    }


}