import { ApiProperty } from "@nestjs/swagger";

export class Sort
{
    @ApiProperty()
    sortField:string;

    @ApiProperty()
    sortOrder:string;
}