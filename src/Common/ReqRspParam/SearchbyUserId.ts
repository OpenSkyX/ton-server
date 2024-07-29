import { ApiProperty } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { IsNotEmpty } from "class-validator";

export class SearchbyUserId extends PageBaseReq{

    @ApiProperty({required: false, description: "用户ID", example: "1"})
    @IsNotEmpty()
    userId: string;
}