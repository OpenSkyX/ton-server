import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { IsNotEmpty, IsOptional } from "class-validator";

export class HoldersRequest extends PageBaseReq {
    
    @ApiProperty()
    @IsNotEmpty()
    token: string;

    @ApiPropertyOptional()
    @IsOptional()
    userId: string;

}