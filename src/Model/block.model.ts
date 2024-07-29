import { Table, Column, Model, Unique, Index, DataType } from "sequelize-typescript";

@Table({
    tableName: "block_latest_lt",
    underscored: true,
    indexes: [],
    comment: "保存处理交易lt",
})
export default class BlockLatestLt extends Model<BlockLatestLt> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;
    
    @Column({
        type: DataType.STRING(64),
        allowNull: false,
        comment: "lt",
    })
    lt: string;

}