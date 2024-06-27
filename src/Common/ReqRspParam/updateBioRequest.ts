import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,Min } from "class-validator";

export class UpdateBioRequest{

    @ApiProperty({ description: 'userId Value must be greater than 0' })
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: 'bio' })
    @IsNotEmpty()
    bio: string;
}