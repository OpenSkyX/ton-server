import { Table, Column, Model, Unique, Index, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import AccountInfo from "./accountInfo.model";

@Table({
  tableName: "coin_list",
  underscored: true,
  indexes: [{ name: "index_address", fields: ["id"], unique: true }],
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

    @Column({ comment: "推荐奖励阶段" })
    recommendReward: string;

    @Column({ comment: "总推荐奖励" })
    totalRecommendReward: string;

    @Column({ comment: "个人推荐奖励" })
    personalRecommendReward: string;

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


    @BelongsTo(() => AccountInfo, 'creatorUserId')
    account?:string;

    replies?:number;

    @Column({ comment: "市值" })
    marketCap:number;

}