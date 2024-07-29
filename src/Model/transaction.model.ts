
import { Table, Column, Model, Unique, Index, DataType, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import Comment from "./comment.model";
import AccountInfo from "./accountInfo.model";
import CoinList from "./coinlist.model";

@Table({
    tableName: "transaction",
    underscored: true,
    indexes: [],
    comment: "点赞表",
})
export default class Transaction extends Model<Transaction> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;

    @Column({ type: DataType.BIGINT, allowNull: false, comment: "用户id" })
    userId: bigint;

    //购买地址
    @Column({ type: DataType.STRING(100), allowNull: false, comment: "购买地址" })
    buyAddress: string;

    @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, defaultValue: 0, comment: "ton数量" })
    ton: number;

    @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, defaultValue: 0, comment: "dude数量" })
    dude: number;

    @ForeignKey(() => CoinList)
    @Column({ type: DataType.STRING(100), allowNull: false, comment: "token合约地址" })
    token: string

    @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, defaultValue: 0, comment: "token价格" })
    price: number

    @Column({ type: DataType.STRING(100), allowNull: false, comment: "token名称" })
    txHash: string

    @Column({ type: DataType.STRING(100), allowNull: false, comment: "交易方向" })
    direction:string;

    @Column({ type: DataType.BIGINT, allowNull: false, comment: "时间戳" })
    timestamp: number

    //ton 储备量
    @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, defaultValue: 0, comment: "ton储备量" })
    tonReserve: number

    //Jetton储备量
    @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, defaultValue: 0, comment: "Jetton储备量" })
    jettonReserve: number

    //原始报文
    @Column({ type: DataType.TEXT, allowNull: false, comment: "原始报文" })
    original: string

    //邀请地址
    @Column({ type: DataType.STRING(100), comment: "邀请地址" })
    inviteAddress: string

    //邀请奖励
    @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, defaultValue: 0, comment: "邀请奖励" })
    inviteReward: number

    @BelongsTo(() => AccountInfo, 'userId')
    account:AccountInfo;

    @HasOne(() => CoinList)
    coin:CoinList;

}