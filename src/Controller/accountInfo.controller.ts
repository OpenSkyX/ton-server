import { Body, Controller, Get, Logger, Param, Post, Put, Query, Request, Res } from "@nestjs/common";
import { ErrorHandler } from "../Common/Response/ErrorHandler";
import { CommonUtils } from "../Common/Utils/CommonUtils";
import { AccountInfoManager } from "../Manager/accountInfo.manager";
import { AccountInfoService } from "../Service/accountInfo.service";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_NAME } from "../Common/Constant";
import axios from 'axios';
import * as crypto from 'crypto';
import AccountInfo from "src/Model/accountInfo.model";
import { UpdateBioRequest } from "../Common/ReqRspParam/updateBioRequest";
import { GetFollowerRequest } from "../Common/ReqRspParam/GetFollowerRequest";
import { logger } from "ethers";
const querystring = require('querystring');

@Controller("account")
export class AccountController {
  constructor(private readonly accountInfoManager: AccountInfoManager, private readonly accountInfoService: AccountInfoService) { }
  public logger = new Logger(AccountController.name);
  telegramApiBaseUrl = 'https://api.telegram.org';
  botToken = TELEGRAM_BOT_TOKEN; // 替换成你的Telegram Bot Token
  botUsername = 'HiToNot_bot'; // 替换成你的Telegram Bot Username
  botRedirectUrl = 'https://ec0f-162-251-63-196.ngrok-free.app/api/account/auth/telegram/callback'; // 替换成你的Bot的回调URL


  @Get("detail/:address")
  async getAccountInfo(@Param("address") address: string) {
    this.logger.log("getAccountInfo", address);
    return await this.accountInfoManager.getAccountDetailByAddress(address.trim()).catch(ErrorHandler.handlerError);;
  }

  @Post("bio")
  async updateBio(@Body() body: UpdateBioRequest) {
    return await this.accountInfoService.updateBio(body).catch(ErrorHandler.handlerError);
  }

  @Get("followerMe")
  async getFollowerMe(@Query() body: GetFollowerRequest) {
    this.logger.log("getFollowerMe", JSON.stringify(body));
    return await this.accountInfoService.getFollowerMe(body).catch(ErrorHandler.handlerError);;
  }

  @Get("follower/:address")
  async getFollower(@Query() body: GetFollowerRequest) {
    return await this.accountInfoService.getFollower(body).catch(ErrorHandler.handlerError);;
  }
  



}