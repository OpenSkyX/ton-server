import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty ,Min} from "class-validator";

export class FollowerRequest{

    @ApiProperty()
    @Min(1, { message: 'userId Value must be greater than 0' })
    userId:bigint;

    @ApiProperty()
    @Min(1, { message: 'userId Value must be greater than 0' })
    followerUserId:bigint;


}