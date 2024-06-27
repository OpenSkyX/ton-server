import { ApiProperty } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { IsNotEmpty } from "class-validator";

export class GetCommentrequest extends PageBaseReq{

    @ApiProperty()
    @IsNotEmpty()
    contract: string;
    
}