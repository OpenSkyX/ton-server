import { Module } from "@nestjs/common";
import { AccountInfoService } from "../Service/accountInfo.service";
import { AccountController } from "../Controller/accountInfo.controller";
import { AccountInfoManager } from "../Manager/accountInfo.manager";

@Module({

  controllers: [AccountController],
  providers: [AccountInfoService, AccountInfoManager],
  
  
})
export class AccountInfoModule { }
