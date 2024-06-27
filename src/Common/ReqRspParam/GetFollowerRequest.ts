import { ApiProperty } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { IsNotEmpty } from "class-validator";

export class GetFollowerRequest extends PageBaseReq{


    @ApiProperty()
    @IsNotEmpty()
    address: string;
}