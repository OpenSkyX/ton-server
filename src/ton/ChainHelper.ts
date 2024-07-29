
import { TransactionSignedEvent } from '@tonconnect/sdk';
import config from '../Config';

export const getTokenAndTonReverse = async (token: string) => {
    try {
        // 构建消息体以调用 get 方法
        const method = 'get_reserve_data'; // 替换为实际的 get 方法名称
        const params = []; // 替换为实际的参数，如果有的话
        // 调用智能合约的 get 方法
        const result = await config.tonweb.provider.call(token, method, params);
        return {ton: parseInt(result.stack[1][1],16), token: parseInt(result.stack[0][1],16)}
    } catch (e) {
        console.log(e)
    }

};


interface Transaction {
    id: string;
    timestamp: number;
    // 其他交易相关字段
}

async function fetchTransactions(address: string, limit: number, lt?: string): Promise<any[]> {
    const transactions = await tonweb.provider.getTransactions(address, { limit, lt });
    return transactions;
}
 export async function getTransactions(address:string,limit:number,it:number) : Promise<any>{
    try {
      const transactions = await config.tonweb.provider.getTransactions(address, limit); // 获取最近 limit 条交易记录
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
    }
  }


  async function fetchTransaction(address: string, limit: number, lt?: string): Promise<any[]> {
    try {
        const transactions = await tonweb.provider.getTransactions(address, { limit, lt });
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

async function getPagedTransactions(address: string, page: number, pageSize: number): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    let currentPage = 1;
    let lastLt: string | undefined = undefined;

    while (currentPage <= page) {
        const fetchedTransactions = await fetchTransaction(address, pageSize, lastLt);
        if (fetchedTransactions.length === 0) {
            break; // No more transactions to fetch
        }

        if (currentPage === page) {
            transactions = fetchedTransactions;
        } else {
            lastLt = fetchedTransactions[fetchedTransactions.length - 1].lt;
        }

        currentPage++;
    }

    return transactions;
}

export async function isContractAddress(address) {
    try {
        // 获取地址的信息
        const addressInfo = await config.tonweb.provider.getAddressInfo(address);
        return addressInfo.code !== null && addressInfo.code !== ''; // 如果 code 不为 null 或者空字符串，则是合约地址
    } catch (error) {
        console.error('Error fetching address information:', error);
        return false;
    }
}