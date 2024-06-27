import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';

@Injectable()
export class CommentRequest {

    @ApiProperty()
    @IsNotEmpty()
    parentId: bigint;

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
    image: string;

    @ApiProperty({ required: false ,title:'被评论的用户ID'})
    @IsNotEmpty()
    toUserId: bigint;
}