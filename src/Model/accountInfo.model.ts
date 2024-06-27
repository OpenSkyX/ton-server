import { Table, Column, Model, Unique, Index, DataType } from "sequelize-typescript";

@Table({
  tableName: "account_info",
  underscored: true,
  indexes: [{ name: "index_address", fields: ["address"], unique: true }],
  comment: "账号信息表",
})
export default class AccountInfo extends Model<AccountInfo> {


  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
  id: bigint;

  @Column({ comment: "telegram user Id" })
  telegramUserId: string;

  @Column({ comment: "tg first name" })
  firstName: string;

  @Column({ comment: "tg last name" })
  lastName: string;

  @Column({ comment: "用户名" })
  username: string;

  @Column({ comment: "钱包地址" })
  address: string;

  @Column({ comment: "头像地址" })
  avatar: string;

  @Column({ comment: "个人介绍" })
  bio: string;

  @Column({ comment: "自己的邀请邀请码" })
  slfeCode!: string;

  @Index
  @Column({ comment: "邀请码" })
  inviteCode: string;

  @Index
  @Column({ field: "inviterId", comment: "邀请者ID" })
  inviterId: number;

  followers : bigint
  likes     : bigint
  replys    : bigint


}
