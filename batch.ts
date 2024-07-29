// import {} from "tonweb";
import TonWeb from 'tonweb';
const { Cell, Slice } = require('ton');


const { utils, HttpProvider, Address } = TonWeb;
const BN = TonWeb.utils.BN;

// 初始化 TonWeb 实例
const tonweb = new TonWeb(new HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')); // 使用测试网
// 如果使用主网，请使用：https://toncenter.com/api/v2/jsonRPC

// 智能合约地址
const contractAddress = 'kQClQciid5darOH8T-HLGMifXuQ8wUblt8G3VY4qzpidJ8cO'; // 替换为实际智能合约地址

const addressString = '0QADccqVIu8un2TwQnvwR54SOmxpdljgxnnvkNRH01rt4jI5'; // 替换为你的地址
const address = new TonWeb.utils.Address(addressString);

// 调用 get 方法
async function callGetMethod() {
  try {
    // 初始化地址
    const address = new utils.Address(contractAddress);

    // 构建消息体以调用 get 方法
    const method = 'get_reserve_data'; // 替换为实际的 get 方法名称
    const params = []; // 替换为实际的参数，如果有的话

    // 调用智能合约的 get 方法
    const result = await tonweb.provider.call(contractAddress, method, params);



    console.log('Get method response:', result);
    console.log(result.stack)
    console.log(`jetton reverse:${parseInt(result.stack[0][1], 16)} , ton reverse:${parseInt(result.stack[1][1], 16)}`)
  } catch (error) {
    console.error('Error calling get method:', error);
  }
}

/* 
需要的信息
op_code：指定的操作码（要根据指定的操作码来来解析数据结构）
jetton_address：代币地址
ton_amount：购买的花费ton数量
jetton_amount ：购买的代币数量
buyer_address ：购买地址
inviter_address：邀请者地址,如果没有，就用0地址
reward ：奖励数量
current_price:购买时的价格
time：时间（如果有时间就也带过来吧）
*/



// callGetMethod();

async function getTransactions() {
  try {
    const transactions = await tonweb.provider.getTransactions(addressString, 10); // 获取最近 10 条交易记录
    return transactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
  }
}

function base64ToBytes(base64) {
  return Buffer.from(base64, 'base64');
}

function parseBody(base64Body) {
  const bodyBytes = base64ToBytes(base64Body);
  const cell = Cell.fromBoc(bodyBytes)[0]; // 从 BOC 解码第一个 cell
  return cell;
}

async function main() {

  const transactions = await getTransactions();
  if (transactions) {
    transactions.forEach(tx => {
      console.log(`Transaction: ${JSON.stringify(tx)}`);
      if (tx.in_msg) {
        // console.log(`From: ${tx.in_msg.source}`);
        // console.log(`To: ${tx.in_msg.destination}`);
        // console.log(`Value: ${tx.in_msg.value}`);
        if (tx.in_msg.msg_data && tx.in_msg.msg_data['@type'] === 'msg.dataRaw') {
          const body = tx.in_msg.msg_data.body;
          const bodyBytes = parseBody(body);
          const slice = bodyBytes.beginParse();
          const op_code = slice.readUint(32);
          if (op_code.toString() == 8888) {
            const minterAddress = slice.readAddress();
            const buyterAddress = slice.readAddress();
            const tonAmount = slice.readCoins();
            const jettonAmount = slice.readCoins();
            const reward = slice.readCoins();
            const currentPrice = slice.readCoins();
            const time = slice.readUint(32);
            console.log('----------------------------------------------------')
            console.log(`Op Code: ${op_code.toString()}`);
            console.log(`minter address: ${minterAddress.toString()}`);
            console.log(`buyterAddress: ${buyterAddress.toString()}`);
            console.log(`tonAmount: ${tonAmount.toString()}`);
            console.log(`jettonAmount: ${jettonAmount.toString()}`);
            console.log(`reward: ${reward.toString()}`);
            console.log(`currentPrice: ${currentPrice.toString()}`);
            console.log(`time: ${time.toString()}`);
            console.log(`time: ${tx.utime}`);
          }
        }
      }
    });
  }
}


function test(){
  // const cell = Cell.fromBoc("b5ee9c7201010201008e0001c3000022b880191a324fe962d98efaa4ef0056bce6d89af341838e1ebd5630c586d4a62aef08b00283e93fbae1dfc2aad4bd4625ae8632704b0eabe2f16192f9e77d266644a20b9102faf080151d059f380168c4c5f7001c0f39e660689da99a4545c601004d801883bdd11384dcc469e9cdbc3a07f0f4d78e114ff715e55c0975c315f47117d44a0e4047f601")[0];
  const cell = parseBody("te6cckEBAgEAaAABwwAAIriAAwz88kbh9KgFGUOdihL043pHD8TSwyCGec41gDXWkUSQAFe32EpcSKv5UOvfqagrHTL1RZBGcBf2UezKNdDVkddhAX14QBSOnMxxAWjATY5AHA87kfiHYFWagqi2AQABAsdbb0A")
  // const cell = Cell.fromBoc("te6cckEBAgEAaAABwwAAIriAAwz88kbh9KgFGUOdihL043pHD8TSwyCGec41gDXWkUSQAFe32EpcSKv5UOvfqagrHTL1RZBGcBf2UezKNdDVkddhAX14QBSOnMxxAWjATY5AHA87kfiHYFWagqi2AQABAsdbb0A")[0]
  const ds = cell.beginParse();
  console.log('opCode', ds.readUint(32).toString());
  console.log('minterAddress', ds.readAddress());
  console.log('buyerAddress', ds.readAddress());
  console.log('tonAmountIn', ds.readCoins());
  console.log('jettonAmountOut', ds.readCoins());
  const reserveTon = ds.readCoins();
  const reserveJetton = ds.readCoins();
  console.log('reserveTon', reserveTon.toString());
  console.log('reserveJetton', reserveJetton.toString());
  console.log('current price', reserveTon.toNumber() / reserveJetton.toNumber() / 10**3);
  const rs = ds.readRef();
  console.log('referralAddress', rs.readAddress()?.toString());
  console.log('reward', rs.readCoins().toString());
  console.log('time', ds.readUint(32).toString());
}

const pageSize = 10;
interface Transaction {
    id: string;
    timestamp: number;
    lt: string;
    // Other transaction-related fields
}

async function fetchTransactions(address: string, limit: number, lt?: string): Promise<Transaction[]> {
    try {
        const transactions = await tonweb.provider.getTransactions(address,  limit, lt );
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
        const fetchedTransactions = await fetchTransactions(address, pageSize, lastLt);
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

// Example: Fetching transactions on page 2 with 10 transactions per page
// getPagedTransactions("0QADccqVIu8un2TwQnvwR54SOmxpdljgxnnvkNRH01rt4jI5", 2, pageSize).then(transactions => {
//     console.log('Paged Transactions:', transactions);
// }).catch(error => {
//     console.error('Error fetching paged transactions:', error);
// });


// main();
test();

// const a = new TonWeb.utils.Address("0:bc11ed3235c5194bfd01f9bc58a584af5f62d4fcb3e2af587ca897129b6bdc8f");
// console.log(a.toString(true, true, true));

