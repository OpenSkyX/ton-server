import { Inject, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl, Length } from "class-validator";

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
    recommendReward: string;

    @ApiProperty()
    @IsNotEmpty()
    totalRecommendReward: string;

    @ApiProperty()
    @IsNotEmpty()
    personalRecommendReward: string;

    @ApiProperty()
    @IsNotEmpty()
    contractAddress: string;

    @ApiProperty()
    @IsNotEmpty()
    createHash: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl({}, { message: 'twitterLink URL must be a valid URL.' })
    twitterLink: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl({}, { message: 'telegramLink URL must be a valid URL.' })
    telegramLink: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl({}, { message: 'websiteLink URL must be a valid URL.' })
    websiteLink: string;
}