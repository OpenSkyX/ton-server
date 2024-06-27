
import { Table, Column, Model, Unique, Index, DataType, HasMany } from "sequelize-typescript";
import Like from "./like.model";

@Table({
  tableName: "comment_info",
  underscored: true,
  indexes: [{ name: "index_address", fields: ["id"], unique: true }],
  comment: "评论表",
})
export default class Comment extends Model<Comment> {

  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
  id: bigint;

  @Column({ comment: "指向父评论的 id,如果为 NULL 表示顶级评论" })
  parentId: bigint;

  @Column({ comment: "token contract" })
  contract: string;

  @Column({ comment: "评论人" })
  userId: bigint;

  @Column({ comment: "被评论人" })
  commentOwnerUserId: bigint;

  @Column({ comment: "评论内容" })
  content: string;

  @Column({ comment: "image" })
  image: string;

  @Column({ comment: "交易方向" })
  direction: string;

  @Column({ comment: "交易数量" })
  amount: string;

  @Column({ comment: "交易 hash" })
  hash: string;

  @Column({ comment: "基准代币" })
  baseToken: string;

  // 定义关联，一个评论可以有多个点赞
  @HasMany(() => Like)
  likes: Like[];

  likeCount?: number; // 定义 likeCount 字段，用于存储点赞数

}