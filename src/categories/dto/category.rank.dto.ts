import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class RankDto {
  @ApiProperty({ type: String, isArray: true })
  @Transform(({ value }) => value.map((v: string) => new Types.ObjectId(v)))
  rank: Types.ObjectId[];
}
