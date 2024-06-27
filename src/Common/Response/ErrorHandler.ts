import { HttpException, HttpStatus } from "@nestjs/common";
import moment from "moment";
import { RspCodeEnum } from "./RspCode";

export class ErrorHandler {
    static handlerError(error: any) {
        console.log(moment().format("YYYYMMDD HH:mm:ss"), 'ERROR', '[handlerError]', error);
        var httpException = new HttpException(JSON.parse(RspCodeEnum.UNEXPECTED_ANOMALY.toString()), HttpStatus.BAD_REQUEST);
        try {
            httpException = new HttpException(JSON.parse(error.message), HttpStatus.BAD_REQUEST);
        } catch (error) {
            console.log(error);
        }
        throw httpException;
    }
}