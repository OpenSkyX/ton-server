import { Injectable, Logger } from "@nestjs/common";
import config from "../Config";
import AccountInfo from "../Model/accountInfo.model";
import Transaction from "../Model/transaction.model";
const logger = new Logger("Transaction");
import { Address } from "@ton/core";
import CoinList from "../Model/coinlist.model";
import { broadcastMessage } from "../wss/WssServer";
import { where } from "sequelize";
import { TraderRequest } from "../Common/ReqRspParam/TraderRequest";



export async function buyHandle(body: any, tx: any): Promise<any> {
    const hash = tx.transaction_id.hash;
    logger.log("BUY start")
    const minterAddress = (new config.tonweb.utils.Address(body.readAddress()!.toString())).toString(true, true, true);//minter地址
    const buyerAddress = Address.parse(body.readAddress()!.toString()).toString({ bounceable: false, testOnly: config.env === "dev" || config.env === "prod" });//(new config.tonweb.utils.Address(body.readAddress()!.toString())).toString(true, true, true);//购买人地址
    const tonAmountIn = body.readCoins().toString();//本次购买的TON输入数量，精度9
    const jettonAmountOut = body.readCoins().toString();//本次购买的代币输出数量，精度6
    const reserveTon = body.readCoins();//购买后合约的TON储备值，精度9
    const reserveJetton = body.readCoins();//购买后合约的代币储备值，精度6
    const currentPrice = reserveTon.toNumber() / reserveJetton.toNumber() / 10 ** 3;
    const rs = body.readRef();
    let referralAddress = rs.readAddress()?.toString();//(new config.tonweb.utils.Address(rs.readAddress()?.toString())).toString(true, true, true);////推荐人地址，可为空地址
    referralAddress = referralAddress ? Address.parse(referralAddress).toString({ bounceable: false, testOnly: config.env === "dev" || config.env === "prod" }) : ""; //referralAddress ? (new config.tonweb.utils.Address(referralAddress)).toString(true, true, true) : ""
    const reward = rs.readCoins().toString(); //奖励。如果推荐人不空，暂定为jetton_amount_out的10%，为空则为0
    const time = body.readUint(32).toString();  //交易时间，秒数

    //更新山丘之王
    if (reserveTon >= config.kingOfMountainMin) {
        //原来的山丘之王下架，
        await CoinList.update({ kingOfMountain: "2" }, {
            where: {
                kingOfMountain: "1"
            }
        });
        //上架新的山丘之王
        await CoinList.update({ 
            tonReserve: tonAmountIn, 
            tokenReserve: jettonAmountOut, 
            kingOfMountain: "1",
            kingOfMountainTime: time * 1000
        }, {
            where: {
                contractAddress: minterAddress
            }
        });
    } else {
        //不是山丘之王只更新储备量
        await CoinList.update({ tonReserve: tonAmountIn, tokenReserve: jettonAmountOut, kingOfMountain: "0" }, {
            where: {
                contractAddress: minterAddress
            }
        });
    }


    //查询用户是否存在
    let userId = BigInt(0);
    const account = await AccountInfo.findOne({ where: { address: buyerAddress } });
    if (account) userId = account.id;

    //根据交易hash查询交易是否存在
    const t = await Transaction.findOne({ where: { txHash: hash } })
    if (!t) {
        await Transaction.create({
            userId: userId,
            txHash: hash,
            token: minterAddress,
            buyAddress: buyerAddress,
            ton: tonAmountIn / 10 ** 9,
            dude: jettonAmountOut / 10 ** 6,
            tonReserve: reserveTon.toNumber() / 10 ** 9,
            jettonReserve: reserveJetton.toNumber() / 10 ** 6,
            price: currentPrice,
            inviteAddress: referralAddress,
            timestamp: time * 1000,
            direction: "buy",
            inviteReward: reward,
            original: JSON.stringify(tx)
        })

        //查询代币信息准备进行广播
        const coin = await CoinList.findOne({ where: { contractAddress: minterAddress } })
        if (coin) {
            //广播
            const trade = new TraderRequest()
            trade.ton = tonAmountIn / 10 ** 9;
            trade.token = minterAddress;
            trade.price = currentPrice;
            trade.direction = "Buy";
            trade.txHash = hash;
            trade.dudeAmount = jettonAmountOut / 10 ** 6;
            trade.userId = userId;
            trade.coinSymbol = coin.coinSymbol;
            trade.coinImage = coin.coinImage;


            const messageBody = {
                title: "trader",
                accountInfo: account || null,
                trader: trade
            }
            broadcastMessage(JSON.stringify(messageBody))
        }


    } else {
        await Transaction.update({
            userId: userId,
            txHash: hash,
            token: minterAddress,
            buyAddress: buyerAddress,
            ton: tonAmountIn / 10 ** 9,
            dude: jettonAmountOut / 10 ** 6,
            tonReserve: reserveTon.toNumber() / 10 ** 9,
            jettonReserve: reserveJetton.toNumber() / 10 ** 6,
            price: currentPrice,
            inviteAddress: referralAddress,
            timestamp: time * 1000,
            direction: "buy",
            original: JSON.stringify(tx)
        }, {
            where: {
                txHash: hash
            }
        })
    }
    //更新代币储备量
    await CoinList.update({ tonReserve: reserveTon.toNumber() / 10 ** 9, tokenReserve: reserveJetton.toNumber() / 10 ** 6 }, {
        where: {
            contractAddress: minterAddress
        }
    });

    /* logger.log('hash:'+ hash);
    logger.log('minterAddress:'+ minterAddress);
    logger.log('buyerAddress:'+ buyerAddress);
    logger.log('tonAmountIn:'+ tonAmountIn);
    logger.log('jettonAmountOut:'+ jettonAmountOut);
    logger.log('reserveTon:'+ reserveTon.toString());
    logger.log('reserveJetton:'+ reserveJetton.toString());
    logger.log('current price:'+ currentPrice);
    logger.log('referralAddress:'+ referralAddress);
    logger.log('reward:'+ reward);
    logger.log('time:'+ time); */
}


export async function sellHandle(body: any, tx: any): Promise<any> {
    const hash = tx.transaction_id.hash;
    logger.log("SELL start")

    const minterAddress = (new config.tonweb.utils.Address(body.readAddress()!.toString())).toString(true, true, true); //minter地址
    const sellerAddress = Address.parse(body.readAddress()!.toString()).toString({ bounceable: false, testOnly: config.env === "dev" || config.env === "prod", }); //出售人地址
    const JettonAmountIn = body.readCoins().toString();//本次出售的代币输入数量，精度6
    const tonAmountOut = body.readCoins().toString(); //本次出售的TON输出数量，精度9
    const reserveTon = body.readCoins();//出售后合约的TON储备值
    const reserveJetton = body.readCoins();//出售后合约的代币储备值
    const currentPrice = reserveTon.toNumber() / reserveJetton.toNumber() / 10 ** 3; //当前价格
    const time = body.readUint(32).toString();//交易时间，秒数

    //查询用户是否存在
    let userId = BigInt(0);
    const account = await AccountInfo.findOne({ where: { address: sellerAddress } });
    if (account) userId = account.id;

    //根据交易hash查询交易是否存在
    const t = await Transaction.findOne({ where: { txHash: hash } })
    if (!t) {
        Transaction.create({
            userId: userId,
            txHash: hash,
            token: minterAddress,
            buyAddress: sellerAddress,
            ton: tonAmountOut / 10 ** 9,
            dude: JettonAmountIn / 10 ** 6,
            tonReserve: reserveTon.toNumber() / 10 ** 9,
            jettonReserve: reserveJetton.toNumber() / 10 ** 6,
            price: currentPrice,
            timestamp: time * 1000,
            direction: "Sell",
            original: JSON.stringify(tx)
        })


        //查询代币信息准备进行广播
        const coin = await CoinList.findOne({ where: { contractAddress: minterAddress } })
        if (coin) {
            //只有创建的时候才广播
            const trade = new TraderRequest()
            trade.ton = tonAmountOut / 10 ** 9;
            trade.token = minterAddress;
            trade.price = currentPrice;
            trade.direction = "Sell";
            trade.txHash = hash;
            trade.dudeAmount = JettonAmountIn / 10 ** 6;
            trade.userId = userId;
            trade.coinSymbol = coin.coinSymbol;
            trade.coinImage = coin.coinImage;

            const messageBody = {
                title: "trader",
                accountInfo: account || null,
                trader: trade
            }
            broadcastMessage(JSON.stringify(messageBody))
        }


    } else {
        Transaction.update({
            userId: userId,
            txHash: hash,
            token: minterAddress,
            buyAddress: sellerAddress,
            ton: tonAmountOut / 10 ** 9,
            dude: JettonAmountIn / 10 ** 6,
            tonReserve: reserveTon.toNumber() / 10 ** 9,
            jettonReserve: reserveJetton.toNumber() / 10 ** 6,
            price: currentPrice,
            timestamp: time * 1000,
            direction: "Sell",
            original: JSON.stringify(tx)
        }, {
            where: {
                txHash: hash
            }
        })
    }

    //更新代币储备量
    await CoinList.update({ tonReserve: reserveTon.toNumber() / 10 ** 9, tokenReserve: reserveJetton.toNumber() / 10 ** 6 }, {
        where: {
            contractAddress: minterAddress
        }
    });



    /* logger.log('hash:' + hash);
    logger.log('minterAddress:' + minterAddress);
    logger.log('buyerAddress:' + buyerAddress);
    logger.log('JettonAmountIn:' + JettonAmountIn);
    logger.log('tonAmountOut:' + tonAmountOut);
    logger.log('reserveTon:' + reserveTon.toString());
    logger.log('reserveJetton:' + reserveJetton.toString());
    logger.log('current price:' + currentPrice);
    logger.log('time:' + time); */


}

