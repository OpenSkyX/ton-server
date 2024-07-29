import { Table, Column, Model, Index, DataType } from "sequelize-typescript";

@Table({
  tableName: "k_line_info",
  comment: "k线信息表",
  underscored: true,
  indexes: []
})
export default class KLineInfo extends Model<KLineInfo> {

  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT, comment: "自增id" })
  id: number;

  @Column({  comment: "token合约地址" })
  contract: string;

  @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, comment: "开盘价" })
  open: number;

  @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, comment: "收盘价" })
  close: number;

  @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, comment: "最高价" })
  high: number;

  @Column({ type: DataType.DECIMAL(30, 16), allowNull: false, comment: "最低价" })
  low: number;

  @Column({ type: DataType.BIGINT, allowNull: false, comment: "时间戳" })
  timestamp: number;

}
