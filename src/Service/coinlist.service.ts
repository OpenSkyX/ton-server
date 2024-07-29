import { Injectable } from "@nestjs/common";
import { SearchCoinRequest, SearchCoinForMeRequest, sortField } from "../Common/ReqRspParam/SearchCoinRequest";
import { CoinListManager } from "../Manager/coinlist.manager";
import { TraderRequest } from "../Common/ReqRspParam/TraderRequest";
import Comment from "../Model/comment.model";
import { Op } from "sequelize";
import Transaction from "../Model/transaction.model";
import KLineInfo from "../Model/kLineInfo.model";
import { HoldersRequest } from "../Common/ReqRspParam/HoldersRequest";
import CoinList from "../Model/coinlist.model";
import AccountInfo from "../Model/accountInfo.model";
import Follower from "../Model/follower.model";
import axios from "axios";
import { get } from "http";
import { convertToOHLC, generateKLineData } from "../Common/Utils/BuildKline";
import { getTokenAndTonReverse, isContractAddress } from "../ton/ChainHelper";
import { Virtual_Market_Value } from "../Common/Constant";
import { stat } from "fs";


@Injectable()
export class CoinListService {

  constructor(private coinManager: CoinListManager) {

  }
  async existCoin(coinAddress: string) {
    return await this.coinManager.existCoin(coinAddress);
  }

  async createCoin(createCoin: any) {
    return await this.coinManager.createCoin(createCoin);
  }

  async getCoinList(search: SearchCoinRequest) {
    const coinlist = await CoinList.findAll({
      where: {
        [Op.or]: [
          {
            status: {
              [Op.ne]: "2"
            }
          },
          { status: null }
        ]

      }
    })

    coinlist.forEach(async element => {
      //查询链上储备量更新数据
      const reverse = await getTokenAndTonReverse(element.contractAddress)
      console.log(`更新储备量： ${JSON.stringify(reverse)}`)
      //更新合约状态
      if (isContractAddress(element.contractAddress)) {
        await CoinList.update({
          status: "2",
          tonReserve: reverse.ton / 10 ** 9,
          tokenReserve: reverse.token / 10 ** 6
        }, {
          where: {
            contractAddress: element.contractAddress
          }
        })
      } else {
        console.log(`不是一个合约地址 :${element.contractAddress}`)
      }
    });

    switch (search.sortField) {
      case sortField.MARKETCAP:
        //按市值查询tokenlist
        return this.coinManager.getCoinListByMarketCap(search);
      case sortField.Hot:
        return await this.coinManager.getCoinListBy24Volume(search);
      case sortField.LASTREPLY:
        //TODO
        return await this.coinManager.getCoinListbyLastReply(search);
      case sortField.REPLYCOUNT:
        return this.coinManager.getCoinListByReplyCount(search);
      case sortField.CREATIONTIME:
        return this.coinManager.getCoinListByCreationTime(search)
      default:
        return await this.coinManager.getCoinList(search);
    }

  }

  async KingOfTheHill() {
    return await this.coinManager.KingOfTheHill();
  }

  async getCoinListForMe(search: SearchCoinForMeRequest) {
    return await this.coinManager.getCoinListForMe(search);
  }

  async searchToken(search: SearchCoinRequest) {
    return await this.coinManager.searchToken(search);
  }

  async trader(trader: TraderRequest) {
    if (trader.comment) {
      //TODO 如果有评论先保存评论
      Comment.create({
        userId: trader.userId,
        content: trader.comment.content,
        contract: trader.token,
        direction: trader.direction,
        amount: trader.ton.toString(),
        hash: trader.txHash,
        baseToken: trader.comment.baseToken
      })
    }
    //TODO 链上查询价格，出售数量，重新计算代币市值并保存数据库

    const reverse = await getTokenAndTonReverse(trader.token)
    console.log(`更新储备量： ${JSON.stringify(reverse)}`)
    if (reverse) {
      await CoinList.update({
        tokenReserve: reverse.token / 10 ** 6,
        tonReserve: reverse.ton / 10 ** 9 //- Virtual_Market_Value
      }, {
        where: {
          contractAddress: trader.token
        }
      })
    }

    // TODO 保存交易记录 已经移植到日志监听
    /* return Transaction.create({
      userId: trader.userId,
      token: trader.token,
      price: trader.price,
      ton: trader.ton,
      direction: trader.direction,
      txHash: trader.txHash,
      dude: trader.dudeAmount,
      timestamp: Date.now()
    }); */
    return "success"
  }


  /**
   * 
   * @param body 
   * @returns 
   */
  async holders(address: string) {
    const response = await axios({
      method: "GET",
      url: `https://tonapi.io/v2/accounts/${address}/jettons`,
    });
    if (response.status != 200) {
      return null;
    }
    return response.data;
  }


  async getKLineDataByTimestemps(token: string, interval: string, currentTimestemps: string) {
    const data = await Transaction.findAll({ where: { token: token, timestamp: { [Op.gt]: currentTimestemps } } });

    const kData = await generateKLineData(data, parseInt(interval))
    return kData;
  }

  async getLastKlineBar(token: string, interval: number) {
    const data = await Transaction.findAll({ where: { token: token }, limit: 10000, });
    const lastKLine = (await convertToOHLC(data, interval)).slice(-1);
    return lastKLine;
  }


  async transactions(body: HoldersRequest) {
    const page = parseInt(body.pageNumber.toString()) || 1;
    const pageSize = parseInt(body.pageSize.toString()) || 10;
    let txs: Array<any>;
    txs = []
    if (body.userId) {
      // 查询关注用户的某个Token交易列表
      const follwer = await Follower.findAll({
        where: {
          userId: body.userId
        }
      })
      let total: number = 0;
      if (follwer) {
        await Promise.all(follwer.map(async (follower) => {
          const c = await Transaction.count({
            where: {
              userId: follower.followerUserId,
              token: body.token
            }
          })
          total += c;
          const tx = await Transaction.findAll({
            where: {
              userId: follower.followerUserId,
              token: body.token
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
          })
          if (tx.length > 0) {
            txs.push(...tx);
          }

        }))

        return { data: txs, total: total };
      } else {
        return null;
      }

    } else {
      // 查询Token的所有人的交易列表
      const total = await Transaction.count({
        where: {
          token: body.token
        }
      });
      const txs = await Transaction.findAll({
        where: {
          token: body.token
        },
        include: [
          {
            model: AccountInfo,
            attributes: ['firstName', 'lastName', 'avatar']
          }
        ],
        order: [
          ['timestamp', 'DESC']
        ],
        offset: (page - 1) * pageSize,
        limit: pageSize
      })
      return { data: txs, total: total };
    }


  }


  async getNewCoin() {
    return CoinList.findOne({
      order: [
        ['createdAt', 'DESC']
      ],
      include: [
        { model: AccountInfo, attributes: ['firstName', 'avatar', 'lastName', 'address'], }
      ]
    })


  }


}