
import { Table, Column, Model, Unique, Index, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Comment from "./comment.model";

@Table({
    tableName: "like",
    underscored: true,
    indexes: [],
    comment: "点赞表",
})
export default class Like extends Model<Like> {
    
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;

    @BelongsTo(() => Comment)
    comment: Comment;

    @Column({ comment: "点赞人" })
    userId: bigint;

    @Column({ comment: "内容所属用户ID" })
    commentOwnerUserId: bigint;

    @ForeignKey(() => Comment)
    @Column({ comment: "点赞内容" })
    commentId: bigint;

    @Column({ comment: "token" })
    token: string;
}