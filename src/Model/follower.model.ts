
import { Table, Column, Model, Unique, Index, DataType } from "sequelize-typescript";

@Table({
    tableName: "follower",
    underscored: true,
    indexes: [],
    comment: "点赞表",
})
export default class Follower extends Model<Follower> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;

    @Column({ comment: "关注人" })
    userId: bigint;

    @Column({ comment: "被关注人" })
    followerUserId: bigint;
}