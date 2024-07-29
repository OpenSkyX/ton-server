
import { Logger } from "@nestjs/common";
import config from "../../Config";
import { buyHandle, sellHandle } from '../Transaction.service';
import { arch } from 'os';
import BlockLatestLt from "../../Model/block.model";
const { Cell, Slice } = require('ton');

// 定义要监控的地址
let latestLt: string | null = null;

const logger = new Logger('TransactionMonitor');

// 获取最新的 LT
async function fetchLatestLt(): Promise<string | null> {
    try {
        const info = await config.tonweb.provider.getAddressInfo(config.LogMonitoringAddress);
        return info.latest_lt;
    } catch (error) {
        logger.error('Error fetching latest LT:', error);
        return null;
    }
}

// 获取交易并处理
async function fetchTransactions(address: string): Promise<void> {
    // await config.tonweb.provider.getAddressInfo(address);

    try {
        const transactions = await config.tonweb.provider.getTransactions(address, 100, latestLt, undefined, undefined, true);
        if (transactions.length > 0) {
            latestLt = transactions[0].lt; // 更新最新的 lt
            transactions.forEach(tx => {
                if (tx.in_msg.msg_data['@type'] == 'msg.dataRaw' && tx.in_msg.msg_data.body.length > 150) {
                    const cell = parseBody(tx.in_msg.msg_data.body);
                    const ds = cell.beginParse();
                    const op_code = ds.readUint(32);
                    if (op_code.toString() == 8888) {
                        buyHandle(ds, tx);
                    } else if (op_code.toString() == 8900) {
                        sellHandle(ds, tx);
                    }
                }
            });
        }
        latestLt = transactions[transactions.length - 1].transaction_id.lt
        logger.log('latestLt', latestLt);
        await BlockLatestLt.update({ lt: latestLt }, { where: { id: 1 } });
    } catch (error: any) {
        if (error.message.includes('cannot locate transaction in block with specified logical time')) {
            logger.warn('Specified LT not found, fetching latest LT...');
            latestLt = await fetchLatestLt(); // 获取最新的 LT
        } else {
            logger.error('Error fetching transactions:'+ error);
        }
    }
}


function base64ToBytes(base64: string) {
    if (typeof base64 !== 'string') {
        // throw new TypeError('The first argument must be of type string');
        logger.log('The first argument must be of type string');
    }
    return Buffer.from(base64, 'base64');
}

function parseBody(base64Body: string) {
    const bodyBytes = base64ToBytes(base64Body);
    const cell = Cell.fromBoc(bodyBytes)[0]; // 从 BOC 解码第一个 cell
    return cell;
}


// 实时监听交易
function listenToTransactions(): void {
    setInterval(() => {
        fetchTransactions(config.LogMonitoringAddress).catch(error => console.error('Error in interval fetch:', error));
    }, 10000); // 每 10 秒查询一次
}

// 初始化并开始监听
export async function initialize(): Promise<void> {
    const block = await BlockLatestLt.findOne()
    if (block) {
        latestLt = block.lt;
    } else {
        latestLt = await fetchLatestLt(); // 获取初始的最新 LT
        await BlockLatestLt.create({ lt: "0" });
    }
    listenToTransactions();
}

// initialize().catch(error => console.error('Error initializing listener:', error));