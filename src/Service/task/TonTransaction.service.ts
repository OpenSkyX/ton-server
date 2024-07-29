import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import config from "../../Config";
import { getTransactions } from "../../ton/ChainHelper";
import { buyHandle, sellHandle } from "../Transaction.service";
const { Cell, Slice } = require('ton');

@Injectable()
export class TonTransaction {

    logger = new Logger("TonTransaction");
    latestLt: string | null = null;

    constructor() {
        if (config.isDev) this.listenToTransactions(); //TODO 临时
        this.logger.log("TonTransaction init");
    }


    // 实时监听交易
    async listenToTransactions() {
        this.latestLt = await this.fetchLatestLt(config.LogMonitoringAddress);
        setInterval(() => {
            this.handleCron().catch(error => console.error('Error in interval fetch:', error));
        }, 10000); // 每 10 秒查询一次
    }



    // 获取最新的 LT
    async fetchLatestLt(address) {
        try {
            const info = await config.tonweb.provider.getAddressInfo(address);
            return info.latest_lt;
        } catch (error) {
            console.error('Error fetching latest LT:', error);
            return null;
        }
    }

    // @Cron(config.task.daoRewardCron)
    async handleCron() {
        console.log("TonTransaction handleCron");
        let it = 0;
        // while (true) {
        //获取最新的it number
        try {
            const txs: any[] = await getTransactions(config.LogMonitoringAddress, 10, it);
            // console.log(txs);
            if (txs) {
                Promise.all(txs.map(async (tx) => {
                    const cell = this.parseBody(tx.in_msg.msg_data.body);
                    const ds = cell.beginParse();
                    const op_code = ds.readUint(32);
                    const hash = tx.transaction_id.hash;
                    console.log('op code', op_code.toString());
                    try {
                        if (op_code.toString() == 8888) {
                            buyHandle(tx, cell);
                        } else if (op_code.toString() == 8900) {
                            sellHandle(tx, cell);
                        }
                    } catch (e) {
                        console.log(`解析异常：${e}`);
                    }

                }));

            }
        } catch (error: any) {
            if (error.message.includes('cannot locate transaction in block with specified logical time')) {
                console.warn('Specified LT not found, fetching latest LT...');
                this.latestLt = await this.fetchLatestLt(config); // 获取最新的 LT
            } else {
                console.error('Error fetching transactions:', error);
            }
        }
        // }
    }

    base64ToBytes(base64) {
        return Buffer.from(base64, 'base64');
    }

    parseBody(base64Body) {
        const bodyBytes = this.base64ToBytes(base64Body);
        const cell = Cell.fromBoc(bodyBytes)[0]; // 从 BOC 解码第一个 cell
        return cell;
    }

}
