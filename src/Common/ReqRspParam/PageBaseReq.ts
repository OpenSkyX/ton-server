import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PageBaseReq {
    @ApiProperty({required: false, description: "当前页码", example: "1"})
    @IsNotEmpty()
    readonly pageNumber: number;//当前页码

    @ApiProperty({required: false, description: "每页记录数", example: "10"})
    @IsNotEmpty()
    readonly pageSize: number;//每页记录数
}
