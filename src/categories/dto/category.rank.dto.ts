import { MongoTransform } from '@/utils/mongo-transform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class RankDto {
  @ApiProperty({ type: String, isArray: true, description: 'Ordered Rank ID' })
  @Transform(new MongoTransform().array())
  @IsArray()
  @IsNotEmpty()
  rank: Types.ObjectId[];
}
