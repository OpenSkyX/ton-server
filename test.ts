import { Address } from '@ton/core';

function convertToMainnetFriendlyAddress(standardAddress: string): string {
    const address = Address.parse(standardAddress);
    return address.toString({ bounceable: false, testOnly: false });
}

function convertToTestnetFriendlyAddress(standardAddress: string): string {
    const address = Address.parse(standardAddress);
    // 创建测试网地址时将 testOnly 设置为 true
    return address.toString({ bounceable: false,testOnly: true });
}

  // 示例调用
  const standardAddress = '0:bc11ed3235c5194bfd01f9bc58a584af5f62d4fcb3e2af587ca897129b6bdc8f';
  const mainnetFriendlyAddress = convertToMainnetFriendlyAddress(standardAddress);
  const testnetFriendlyAddress = convertToTestnetFriendlyAddress(standardAddress);
  
  console.log('Mainnet Friendly Address:', mainnetFriendlyAddress);
  console.log('Testnet Friendly Address:', testnetFriendlyAddress);