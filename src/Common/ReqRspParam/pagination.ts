import { ApiProperty } from "@nestjs/swagger";

export class Pagination{

    @ApiProperty()
    page:number;

    @ApiProperty()
    pageSize:number;
    
}