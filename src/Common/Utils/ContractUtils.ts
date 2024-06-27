import { Provider } from "@ethersproject/abstract-provider";
import { Contract } from "web3-eth-contract";

import { ethers } from "ethers";
import config from "../../Config";

/**
 * 获取ethers合约对象
 * @param jsonArtifact 相对于contracts目录的路径
 * @param address 合约地址
 * @param signerProvider 用户provider
 */
function getEthersContract(jsonArtifact: any, address: string, signerProvider?: Provider): ethers.Contract {
  var defaultProvider = new ethers.providers.JsonRpcProvider(config.providerEndPoint);
  let contractObj = new ethers.Contract(address, jsonArtifact.abi, signerProvider ?? defaultProvider);
  return contractObj;
}

/**
 * 获取web3js合约对象
 * @param contractArtifact 相对于contracts目录的路径
 * @param address 合约地址
 * @param signerProvider 用户provider
 */
function getWeb3Contract(contractArtifact: any, address: string): Contract {
  return new config.web3Obj.eth.Contract(contractArtifact.abi, address);
}


export default {
  getEthersContract,
  getWeb3Contract,
};
