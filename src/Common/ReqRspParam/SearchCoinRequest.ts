import { ApiProperty } from "@nestjs/swagger";
import { PageBaseReq } from "./PageBaseReq";
import { Pagination } from "./pagination";
import { Sort } from "./sort";

export class SearchCoinRequest{
    
    @ApiProperty()
    pagination:Pagination;

    @ApiProperty()
    sort:Sort

    @ApiProperty({required:false,description:"用户ID",example:"1"})
    userId:string;
}