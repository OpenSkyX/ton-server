const TonWeb = require('tonweb');
// const fetch = require('node-fetch');
const pLimit = require('p-limit');

const TonWebHttp = TonWeb.HttpProvider;
const tonweb = new TonWeb(new TonWebHttp('https://toncenter.com/api/v2/jsonRPC'));
const limit = pLimit(5); // 每次只允许最多 5 个并发请求

async function getBlockTransactions(workchain, shard, seqno) {
    const response = await fetch(`https://toncenter.com/api/v2/getBlockTransactions?workchain=${workchain}&shard=${shard}&seqno=${seqno}`);
    const data = await response.json();
    return data.result.transactions;
}

async function main() {
    const workchain = 0;  // 工作链，通常 0 是主链
    const shard = '-9223372036854775808';  // 主链上的 shard 值
    const seqnoStart = 123456;  // 起始区块号
    const seqnoEnd = 123460;  // 结束区块号
    const contractAddress = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';  // 替换为你的合约地址

    const tasks = [];

    for (let seqno = seqnoStart; seqno <= seqnoEnd; seqno++) {
        tasks.push(limit(() => getBlockTransactions(workchain, shard, seqno).then(transactions => {
            transactions.forEach(tx => {
                if (tx.in_msg && tx.in_msg.source === contractAddress) {
                    console.log('Transaction:', tx);
                }
            });
        })));
    }

    await Promise.all(tasks);

    // 你可以根据需要添加更多逻辑，如循环检索多个区块
}

main().catch(console.error);