import moment from "moment";
import { UserNodeTypeEnum } from "../Enum";
const { ethers } = require("ethers");
const { Op } = require("sequelize");

export class CommonUtils {
  /**
   * 简单赋值
   * @param fromObj 数据源
   * @param toObj 复制到该object
   * @param exclude 本次复制不包括这里面的字段
   */
  static simpleCopy(fromObj: any = {}, toObj: any = {}, exclude: any = []) {
    if (CommonUtils.isEmptyObject(fromObj)) return;

    for (const [key, value] of Object.entries(fromObj)) {
      if (exclude && exclude.length > 0 && exclude.includes(key)) continue;
      toObj[key] = value;
    }
    return toObj;
  }

  /**
   * @notice 判断字符串是否未空
   * @param constantStr 被校验的字符串
   * @returns  true: 字符串未空   false: 字符串非空
   */
  static isStringEmpty(constantStr: string) {
    return typeof constantStr == "undefined" || constantStr == null || constantStr == "";
  }

  /**
   * 字符时间转时间戳(返回毫秒)
   */
  static strTimeToTimeStamps(strtime: string) {
    //时间转换
    var date = new Date(strtime);
    //获取时间戳
    var timeStamps = date.getTime();
    return timeStamps;
  }

  //@brief 睡眠指定时长
  static sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * @notice 计算分页查询的起始行和每页记录数
   * @param pageNumber 页码
   * @param pageSize 每页记录数
   */
  static calculatePageParam(pageNumber: number, pageSize: number) {
    let realSize = pageSize && pageSize > 0 ? pageSize : 10;
    let realPageNumber = pageNumber && pageNumber > 0 ? pageNumber - 1 : 0;
    let startRow = realPageNumber * realSize;
    return { offset: parseInt(String(startRow)), limit: parseInt(String(realSize)) };
  }

  /**
   * @notice 将参数对象转换成model的查询参数
   * @param fromObj 参数对象
   * @param exclude 不包含指定的属性
   */
  static obj2ModelQueryParam(fromObj: any = {}, exclude: any = []) {
    //如果对象为空，则直接返回空数组
    if (CommonUtils.isEmptyObject(fromObj)) return [];
    let dynamicParams: any;

    for (const [keyName, value] of Object.entries(fromObj)) {
      //如果key为指定剔除的属性，则跳过
      if (exclude && exclude.length > 0 && exclude.includes(keyName)) continue;
      //值为空的，则跳过
      if (CommonUtils.isBlankValue(value)) continue;
      //如果转换成字符串后包含逗号【,】,则表明是数组
      let finalValue = value;
      if (String(value).includes(",")) {
        let valueArray = value;
        if (!Array.isArray(value)) valueArray = [value];
        finalValue = { [Op.in]: valueArray };
      }

      let toObj: any = {};
      toObj[keyName] = finalValue;
      if (!dynamicParams) {
        dynamicParams = [toObj];
      } else {
        dynamicParams.push(toObj);
      }
    }
    return dynamicParams;
  }

  /**
   * 判断是否为空对象
   * @param obj
   */
  static isEmptyObject(obj: any): boolean {
    if (typeof obj === "object" && Object.keys(obj).length > 0) return false;
    return true;
  }

  /**
   * 判断对象是否为空
   * @param value
   */
  static isBlankValue(value: any): boolean {
    if (value === null || value == undefined || value === "") {
      return true;
    }
    return false;
  }

  static nodeRewardLeafFormat(termData: string, address: string, daoReward: number, supperNodeReward: number, decimals: number) {
    daoReward = daoReward ? daoReward : 0;
    supperNodeReward = supperNodeReward ? supperNodeReward : 0;
    let reward = parseFloat(String(parseFloat(String(daoReward)) + parseFloat(String(supperNodeReward)))).toFixed(decimals);
    let rewardBN = ethers.utils.parseUnits(String(reward), decimals);
    var formatRsp = ethers.utils.solidityKeccak256(["address", "string", "string", "string", "uint256"], [address.toLowerCase(), "_", termData, "_", rewardBN]);
    return formatRsp;
  }

  static nodeTeamStakedLeafFormat(address: string, nodeLevel: number, teamStakedThsToken: number, decimals: number) {
    nodeLevel = nodeLevel ? nodeLevel : UserNodeTypeEnum.SIMPLE;
    teamStakedThsToken = teamStakedThsToken ? teamStakedThsToken : 0;
    let stakedBN = ethers.utils.parseUnits(String(teamStakedThsToken), decimals);
    var formatRsp = ethers.utils.solidityKeccak256(
      ["address", "string", "uint256", "string", "uint256"],
      [address.toLowerCase(), "_", nodeLevel, "_", stakedBN]
    );
    return formatRsp;
  }

  /**
   * @notice 打印debug日志
   * @param constantStr 打印的日志的内容
   */
  static logDebug(constantStr: string) {
    console.log(moment().format("YYYYMMDD HH:mm:ss"), "DEBUG", constantStr);
  }

  /**
   * @notice 打印warn日志
   * @param constantStr 打印的日志的内容
   */
  static logWarn(constantStr: string) {
    console.log(moment().format("YYYYMMDD HH:mm:ss"), "WARN", constantStr);
  }

  /**
   * @notice 打印info日志
   * @param constantStr 打印的日志的内容
   */
  static logInfo(constantStr: string) {
    console.log(moment().format("YYYYMMDD HH:mm:ss"), "INFO", constantStr);
  }

  /**
   * @notice 打印error日志
   * @param constantStr 打印的日志的内容
   */
  static logError(constantStr: string, err = {}) {
    console.log(moment().format("YYYYMMDD HH:mm:ss"), "ERROR", constantStr, err);
  }
}
