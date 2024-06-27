

import { Table, Column, Model, Unique, Index, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Comment from "./comment.model";
import { Account } from "@tonconnect/sdk";
import AccountInfo from "./accountInfo.model";


@Table({
    tableName: "message",
    underscored: true,
    indexes: [{ name: "index_address", fields: ["id"], unique: true }],
    comment: "信息中心",
})
export default class Message extends Model<Message> {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
    id: bigint;

    @Column({ comment: "发送者" })
    sender: bigint;

    @Column({ comment: "接收者" })
    receiver: bigint;

    @Column({ comment: "消息内容" })
    content: string;

    @Column({ comment: "消息类型：1:评论：2:点赞 ，3:关注" })
    type: number;

    @Column({ comment: "消息状态：0:未读，1:已读" })
    status: number;

    @Column({ comment: "token" })
    token: string;

    @Column({ comment: "评论ID" })
    @ForeignKey(() => Comment)
    commentId: bigint;

    @BelongsTo(() => Comment, 'commentId')
    comment : Comment;


    userInfo: AccountInfo;


}