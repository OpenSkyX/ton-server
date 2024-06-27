import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TraderCommentRequest {
    
    @ApiProperty()
    @IsNotEmpty()
    contract: string;

    @ApiProperty()
    @IsNotEmpty()
    userId: bigint;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    direction : string;

    @ApiProperty()
    @IsNotEmpty()
    amount: string;

    @ApiProperty()
    @IsNotEmpty()
    hash: string;

    @ApiProperty()
    @IsNotEmpty()
    baseToken: string;

}