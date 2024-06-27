//方法调用返回码常量

export class RspCode {
  errcode: number;
  errmsg: string;

  constructor(errcode: number, errmsg: string) {
    this.errcode = errcode;
    this.errmsg = errmsg;
  }

  // 返回一个字符串
  toString(): string {
    return JSON.stringify({ errcode: this.errcode, errmsg: this.errmsg });
  }
}

export class RspCodeUtil {
  static getInstance(errcode: number, errmsg: string): RspCode {
    return new RspCode(errcode, errmsg);
  }

  static initRspCodeStr(errcode: number, errmsg: string): string {
    return new RspCode(errcode, errmsg).toString();
  }
}

export class RspCodeEnum {
  static SUCCESS = RspCodeUtil.getInstance(200, "success"); //方法调用成功
  static UNEXPECTED_ANOMALY = RspCodeUtil.getInstance(1, "An unexpected anomaly"); //意料之外的异常

  // //test: 101---
  // static API_KEY_INVALID_ID = RspCodeUtil.getInstance(101001, "invalid apiKey id");
 
}
