import { Table, Column, Model, Unique, Index, DataType } from "sequelize-typescript";

@Table({
    tableName: "account_invite",
    underscored: true,
    indexes: [],
    comment: "代币邀请关系绑定",
})
export default class AccountInvite extends Model<AccountInvite> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;

    @Column({
        type: DataType.STRING(64),
        allowNull: false,
        comment: "地址",
    })
    currentTgId: string;

    @Column({
        type: DataType.STRING(64),
        allowNull: false,
        comment: "邀请人地址",
    })
    inviteTgId: string;

    //代币地址
    @Column({
        type: DataType.STRING(64),
        allowNull: false,
        comment: "代币地址",
    })
    tokenAddress: string;

}