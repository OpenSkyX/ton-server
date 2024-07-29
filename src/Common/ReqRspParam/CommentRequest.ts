import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MaxLength, IsOptional } from 'class-validator';

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

    @ApiPropertyOptional()
    @IsOptional()
    image: string;

    @ApiProperty({ required: false ,title:'被评论的用户ID'})
    @IsNotEmpty()
    toUserId: bigint;
}