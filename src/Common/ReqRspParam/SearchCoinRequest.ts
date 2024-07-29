import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { Pagination } from "./pagination";
import { Sort } from "./sort";
import { IsNotEmpty, IsOptional } from "class-validator";


enum orderType {
    DESC= 'DESC',
    ASC = 'ASC'
  }

export enum sortField {
    Hot = 'Hot',
    LASTREPLY = 'LASTREPLY',
    REPLYCOUNT = 'REPLYCOUNT',
    MARKETCAP = 'MARKETCAP',
    CREATIONTIME = 'CREATIONTIME'
  }


export class SearchCoinRequest extends PageBaseReq{
    
    @ApiProperty({enum: sortField,default:sortField.Hot})
    @IsNotEmpty()
    sortField:string;

    @ApiProperty({enum: orderType,default:orderType.DESC})
    @IsNotEmpty()
    sortOrder:string;

    @ApiPropertyOptional()
    @IsOptional()
    userId:string;

    @ApiPropertyOptional()
    @IsOptional()
    contract:string;

    @ApiPropertyOptional()
    @IsOptional()
    name?:string;
}

export class SearchCoinForMeRequest extends PageBaseReq{
    
  @ApiProperty()
  @IsNotEmpty()
  sortField:string;

  @ApiProperty({enum: orderType,default:orderType.DESC})
  @IsNotEmpty()
  sortOrder:string;

  @ApiPropertyOptional()
  @IsOptional()
  userId:string;

  @ApiPropertyOptional()
  @IsOptional()
  contract:string;

  @ApiPropertyOptional()
  @IsOptional()
  name?:string;
}