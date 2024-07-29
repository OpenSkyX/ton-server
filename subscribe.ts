const TonWeb = require('tonweb');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false // 为了测试目的忽略自签名证书，不建议在生产环境中使用
});

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://test.toncenter.com/api/v2/jsonRPC',{ httpsAgent })); // 使用 TON Center 提供的 API

const address = '0QADccqVIu8un2TwQnvwR54SOmxpdljgxnnvkNRH01rt4jI5'; // 替换为你要监听的地址
let latestLt = null;

// 获取交易并处理
async function fetchTransactions(address) {
    try {
        const transactions = await tonweb.provider.getTransactions(address, { limit: 10, lt: latestLt });
        if (transactions.length > 0) {
            latestLt = transactions[0].lt; // 更新最新的 lt
            transactions.reverse().forEach(tx => {
                console.log('New transaction:', tx);
                // 在这里添加处理交易的逻辑
            });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

// 实时监听交易
function listenToTransactions(address) {
    setInterval(() => {
        fetchTransactions(address);
    }, 10000); // 每 10 秒查询一次
}

// 开始监听
listenToTransactions(address);