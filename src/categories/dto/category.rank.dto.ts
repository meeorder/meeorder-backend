import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class RankDto {
  @ApiProperty({ type: String, isArray: true, description: 'Ordered Rank ID' })
  @Transform(({ value }) => value.map((v: string) => new Types.ObjectId(v)))
  @IsArray()
  @IsNotEmpty()
  rank: Types.ObjectId[];
}
