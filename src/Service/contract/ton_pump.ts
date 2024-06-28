const { TonClient } = require('ton-client-node-js');

async function main() {
  const client = new TonClient({
    network: {
      endpoints: ['http://localhost'], // 替换为你的 Ton 网络端点
    },
  });

  const contractAddress = '<your_contract_address>';
  const contractABI = {
    // 合约 ABI
  };

  try {
    const contract = new client.Contract({
      abi: contractABI,
      address: contractAddress,
    });

    const result = await contract.methods.getValue();
    console.log('Method result:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

main();