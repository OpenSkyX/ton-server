import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { IsNotEmpty, IsOptional } from "class-validator";

export class GetCommentrequest extends PageBaseReq{

    @ApiProperty()
    @IsNotEmpty()
    contract: string;

    @ApiPropertyOptional({description:""})
    @IsOptional()
    userId: bigint;
    
}