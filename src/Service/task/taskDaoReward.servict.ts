import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CommonUtils } from "../../Common/Utils/CommonUtils";
import config from "../../Config";
import { AccountTermInfoStatusEnum } from "../../Common/Enum"
import { AccountInfoManager } from "src/Manager/accountInfo.manager";

let isTaskRunning = false;

@Injectable()
export class TaskDaoRewardService {
  constructor(
    // private readonly accountManager:AccountInfoManager
  ) {
    // if (config.isDev) this.handleCron(); //TODO 临时
    console.log("TaskDaoRewardService init");
  }

  @Cron(config.task.daoRewardCron)
  async handleCron() {
    if (isTaskRunning) return;
    isTaskRunning = true;
    CommonUtils.logDebug("[TaskDaoRewardService] start");
    try {
      
    } catch (ex) {
      CommonUtils.logError("TaskDaoRewardService has error", ex);
    } finally {
      isTaskRunning = false;
    }
  }
}
