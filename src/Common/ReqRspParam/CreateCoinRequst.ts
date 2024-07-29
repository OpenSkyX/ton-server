import { Inject, Injectable } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl, Length } from "class-validator";

@Injectable()
export class CreateCoinRequest {

    @ApiProperty()
    @IsNotEmpty()
    creatorUserId: bigint;

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 32)
    coinName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 11)
    coinSymbol: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 1000)
    coinIntro: string;

    @ApiProperty()
    @IsNotEmpty()
    coinImage: string;

    @ApiProperty()
    @IsNotEmpty()
    contractAddress: string;

    @ApiProperty()
    @IsNotEmpty()
    createHash: string;


    @ApiPropertyOptional({description:`
      1:Claim rewards immediately during the presale period 
      2:Claim rewards immediately after adding to the LP pool 
      3:Claim rewards at a custom time after adding to the LP pool.`
    })
    @IsOptional()
    rewardType: string;


    @ApiPropertyOptional({description:""})
    @IsOptional()
    rewardValue: string;

    @ApiPropertyOptional({description:"百分比"})
    @IsOptional()
    percent:string;


    @ApiPropertyOptional({description:""})
    @IsOptional()
    recommendReward: string;

    @ApiPropertyOptional({description:""})
    @IsOptional()
    totalRecommendReward: string;

    @ApiPropertyOptional({description:""})
    @IsOptional()
    personalRecommendReward: string;

    @ApiPropertyOptional({description:""})
    @IsOptional()
    // @IsUrl({}, { message: 'twitterLink URL must be a valid URL.' })
    twitterLink: string;

    @ApiPropertyOptional({description:"telegram url",example:"https:t.com/xxx"})
    @IsOptional()
    // @IsUrl({}, { message: 'telegramLink URL must be a valid URL.' })
    telegramLink: string;

    @ApiPropertyOptional({description:"website url",example:"http://x.com"})
    @IsOptional()
    // @IsUrl({}, { message: 'websiteLink URL must be a valid URL.' })
    websiteLink: string;
}