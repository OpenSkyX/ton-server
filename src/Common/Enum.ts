//通用的状态
export class CommStatusEnum {
  static ACTIVE = 1; //启用状态
  static FREEZE = 2; //冻结状态
}

//用户节点类型
export class UserNodeTypeEnum {
  static SIMPLE = 1; //普通用户
  static NODE = 2; //节点用户
  static BIG_NODE = 3; //大节点用户
  static SUPPER_NODE = 4; //超级节点用户
}

export class DaoRewardFundTypeEnum {
  static TECH = 0; //技术支出
  static OPERATIONS = 1; //运营
  static VENECTAR = 2; //VeNectar奖励
  static NODE_BONUS = 3; //节点奖励
}

export class AccountTermInfoStatusEnum {
  static SETTLED_BUT_NOT_SUPPORT_CLAIM = -1; //已结算，但是不发奖励
  static IN_SETTLEMENT = 1; //结算中
  static SETTLED_AND_WAITING_CONFIRM = 2; //已结算，待确认上链
  static CONFIRMED_AND_WAITING_CHAIN = 3; //已确认可上链
  static SENDED_CHAIN = 4; //结算数据已上链
  static CLAIMED = 5; //已领取
}

export class RebaseRateConfigIdEnum {
  static DEFAULT = 1; //默认收益率
  static MEDIUM = 2; //中等收益率
  static HIGHT = 3; //高等收益率
}

//中心平台名称
export class MilliSecondEnum {
  static SECOND = 1000; //一秒
  static MINUTE = 60 * MilliSecondEnum.SECOND; //分钟
  static HOUR = 60 * MilliSecondEnum.MINUTE; //小时
  static DAY = 24 * MilliSecondEnum.HOUR; //天
  static WEEK = 7 * MilliSecondEnum.DAY; //一周
  static MONTH = 30 * MilliSecondEnum.DAY; //一月
  static QUARTER = 3 * MilliSecondEnum.MONTH; //一季度
  static YEAR = 12 * MilliSecondEnum.MONTH; //一年
}

//私钥缓存的name值
export class PrivateKeyTypeEnum {
  static KEEPER_SUFFIX = 1; //keeper的私钥
}

//仓位的状态
export class PositionStatusEnum {
  static HOLDING = 1; //持仓
  static LIQUIDATING = 2; //清算中
  static EMPTY = 3; //空仓
}

//仓位的方向
export class PositionDirectionEnum {
  static SHORT = 0; //看空
  static LONG = 1; //看多
}

//订单簿重订单的状态
export class OrderStatusEnum {
  static ORDING = 1; //订单等待执行中
  static CANCELED = 2; //订单已取消
  static EXECUTING = 3; //订单执行中
  static EXECUTED = 4; //订单已执行
}

//时间周期间隔
export class TimeInterValEnum {
  static MINUTE = 1; //分
  static HOUR = 2; //时
  static DAY = 3; //天
}
