import { CallHandler, ExecutionContext, Injectable, NestInterceptor ,Logger} from "@nestjs/common";
import { Observable } from "rxjs";
import { RspCodeEnum } from "../Response/RspCode";
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor() {}
  private readonly logger = new Logger('LoggingInterceptor');
  private readonly maxResponseLength = 100; // 设定最大打印长度

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;

    this.logger.log(`Incoming request - Method: ${method}, URL: ${url}, Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      map((data) => {
        const truncatedData = this.truncateResponse(data);
        this.logger.log(`Outgoing response - Method: ${method}, URL: ${url}, Response: ${JSON.stringify(truncatedData)}`);
        return {
          data,
          code: RspCodeEnum.SUCCESS.errcode,
          message: RspCodeEnum.SUCCESS.errmsg,
        };
      })
    );
  }

  private truncateResponse(data: any): any {
    if (typeof data === 'string' && data.length > this.maxResponseLength) {
      return `${data.substring(0, this.maxResponseLength)}... (truncated)`;
    }
    // 可根据实际情况处理其他类型的数据
    if( typeof data === "object" && JSON.stringify(data).length > this.maxResponseLength){
      return `${JSON.stringify(data).substring(0, this.maxResponseLength)}... (truncated)`;
    }
    return data;
  }
}
