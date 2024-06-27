import { ApiProperty } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { IsNotEmpty } from "class-validator";

export class MessageRequest extends PageBaseReq{

    @ApiProperty({description:"用户ID",example:"1"})
    @IsNotEmpty({message:"用户ID不能为空"})
    userId: string;
}