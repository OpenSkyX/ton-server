import ContractUtils from "../../Common/Utils/ContractUtils";
import contractArtifact from "./artifacts/UniswapV2Pair.json";
const { ethers } = require("ethers");
import { Contract } from "web3-eth-contract";
import { CommonUtils } from "../../Common/Utils/CommonUtils";
import BigNumber from "bignumber.js";

/**
 * 获取代币的价格
 */

/**
 * @notice 根据pair和其中一个token地址获取另外一个代币的价格
 * @param pairAddress 交易对地址
 * @param sourceAddress 根据这个token地址获取另外一个代币的价格
 */
export const getOtherTokenPrice = async (pairAddress: string, sourceAddress: string) => {
  CommonUtils.logInfo(`[getOtherTokenPrice]start. pairAddress:${pairAddress} sourceAddress:${sourceAddress}`);
 
};

