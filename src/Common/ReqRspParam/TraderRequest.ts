import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { TraderCommentRequest } from "./TraderCommentRequest";
import { CommentRequest } from "./CommentRequest";

class TraderComment{

  @ApiProperty()
  @IsNotEmpty()
  baseToken:string;

  @ApiProperty()
  @IsNotEmpty()
  content:string;

  @ApiPropertyOptional()
  @IsOptional()
  image:string;
}


export class TraderRequest {

  @ApiProperty()
  @IsNotEmpty()
  ton: number;  

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: bigint;

  @ApiProperty()
  @IsNotEmpty()
  dudeAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  txHash: string;

  @ApiPropertyOptional({ description: '评论信息'})
  @IsOptional()
  comment:TraderComment;

  @ApiProperty()
  @IsNotEmpty()
  direction:string;

  @ApiPropertyOptional({ description: '代币简称'})
  @IsOptional()
  coinSymbol:string;

  @ApiPropertyOptional({ description: '代币图片'})
  @IsOptional()
  coinImage:string;

}




