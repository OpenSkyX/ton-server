import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty ,Min} from "class-validator";


export class LikeRequest {

    @ApiProperty()
    @Min(1, { message: 'userId Value must be greater than 0' })
    userId: bigint;

    @ApiProperty()
    @Min(1, { message: 'commentOwnerUserId Value must be greater than 0' })
    commentOwnerUserId: bigint;

    @ApiProperty()
    @Min(1, { message: 'commentId Value must be greater than 0' })
    commentId: bigint;

    @ApiProperty()
    @IsNotEmpty()
    token: string;
}