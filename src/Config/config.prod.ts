let Web3 = require("web3");
import { ethers } from "ethers";
import { TELEGRAM_BOT_TOKEN } from "src/Common/Constant";
const providerEndPointConst = "https://rpc.themis.capital/filecoin"; //"https://api.node.glif.io"; //"https://rpc.themis.capital/filecoin";//"https://infura.sftproject.io/filecoin/rpc/v1"; ////"https://filecoin.chainup.net/rpc/v1"; //"https://api.node.glif.io"; //"https://rpc.ankr.com/filecoin";
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
    /* user: "devlop",
    password: "Cc5pU0731hvnA6yl8dBMHSKzeL94TiJ2", */
    user: "devlop",
    password: "%7RF9Xu&wDBt",
    database: "ton_pump_server",
    charset: "UTF8MB4_GENERAL_CI",
    connectTimeout: 10000,
    connectionLimit: 100,
  },

  serverPort: 3344,
  autoCreateTable: true, //自动建表
  logSql: true, //打印sql日志

  address: {

  },
  keys: {
    daoRewardManager: "", //dao分红管理员私钥、keeper
    priceFeedGovAdmin: "", //有权写priceFeedGov的用户 0xf267e6270F03fecCAda75d6c93032b33cAa4Aecf
  },
  transferBatch: {
    managerKey: "", //空投管理员的私钥  0x2D2c926097f4a93475842A814539865B5cDe0D0e
    airDropContract: "", //空投合约的地址
    addressTotal: 100000, //计划总共空投地址数
    addressCount: 300, //每次产生地址的个数
    addressAmount: 20000, //每次空投的金额，0.00002个THS
    timeCron: "0 1 15 * * ?", //批量产生THS地址，并空投的时间，每天凌晨1点
  },
  task: {
    syncEventStartBlock: 2866173,
    daoRewardCron: "10 1 7,17,27 * *", //同步新注册账号的间隔时间  每个月7,17,27日1时10分执行

  },
};
