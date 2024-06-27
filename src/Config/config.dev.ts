let Web3 = require("web3");
import { ethers } from "ethers";
import { TELEGRAM_BOT_TOKEN } from "src/Common/Constant";
const providerEndPointConst = "https://rpc.themis.capital/filecoin"; //"https://api.node.glif.io";// //"https://api.node.glif.io"; //"https://rpc.ankr.com/filecoin";
const ethersProviderConst = new ethers.providers.JsonRpcProvider(providerEndPointConst);
const web3ProviderConst = new Web3.providers.HttpProvider(providerEndPointConst);


export default {
  providerEndPoint: providerEndPointConst,
  ethersProvider: ethersProviderConst,
  web3Provider: web3ProviderConst,
  web3Obj: new Web3(web3ProviderConst),
  db: {
    host: "127.0.0.1",
    port: 3306,
    /* 
    user: "devlop",
    password: "%7RF9Xu&wDBt",
    */
    user: "root",
    password: "12345678",
    database: "pump_dev",
    charset: "UTF8MB4_GENERAL_CI",
    connectTimeout: 10000,
    connectionLimit: 100,
  },

  serverPort: 8080,
  autoCreateTable: true, //自动建表
  logSql: true, //打印sql日志
  address: {
  },
  task: {
    syncEventStartBlock: 3218500,
    daoRewardCron: "10 1 7,17,27 * *", //同步新注册账号的间隔时间  每个月7,17,27日1时10分执行

  },

};
