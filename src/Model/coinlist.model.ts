import { Table, Column, Model, Unique, Index, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import AccountInfo from "./accountInfo.model";
import Transaction from "./transaction.model";

@Table({
  tableName: "coin_list",
  underscored: true,
  indexes: [],
  comment: "创建代币列表",
})
export default class CoinList extends Model<CoinList> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;

    @ForeignKey(() => AccountInfo)
    @Column({ comment: "创建者" })
    creatorUserId: bigint;

    @Column({ comment: "代币名称" })
    coinName: string;

    @Column({ comment: "代币符号" })
    coinSymbol: string;

    @Column({ comment: "代币简介" })
    coinIntro: string;

    @Column({ comment: "代币图片" })
    coinImage: string;

    @Column({ comment: `
      奖励类型:
      1:Claim rewards immediately during the presale period 
      2:Claim rewards immediately after adding to the LP pool 
      3:Claim rewards at a custom time after adding to the LP pool.` })
    rewardType: string;

    @Column({ comment: "奖励值" })
    rewardValue: string;

    @Column({ comment: "奖励百分比" })
    percent:string;

    @Column({ comment: "推荐奖励阶段" })
    recommendReward: string;

    @Column({ comment: "总推荐奖励" })
    totalRecommendReward: string;

    @Column({ comment: "个人推荐奖励" })
    personalRecommendReward: string;

    @ForeignKey(() => Transaction)
    @Column({ comment: "合约地址" })
    contractAddress: string;

    @Column({ comment: "创建Hash" })
    createHash: string;

    @Column({ comment: "twitter 连接" })
    twitterLink: string;

    @Column({ comment: "telegram 连接" })
    telegramLink: string;

    @Column({ comment: "website 连接" })
    websiteLink: string;

    //山丘之王
    @Column({ comment: "山丘之王:1:最新的 2:过去的" })
    kingOfMountain: string;

    @Column({ comment: "成为山丘之王的时间" })
    kingOfMountainTime: number;


    @BelongsTo(() => AccountInfo, 'creatorUserId')
    account?:string;

    replies?:number;

    @Column({ comment: "token储备量" })
    tokenReserve:number;

    @Column({ comment: "ton储备量" })
    tonReserve:number;

    @Column({ comment: "市值" })
    marketCap:number;

    @Column({ comment: "状态 1:待确认 2:完成" })
    status:string;

}