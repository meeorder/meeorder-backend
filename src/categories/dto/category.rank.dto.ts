import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class RankDto {
  @ApiProperty({ isArray: true })
  rank: Types.ObjectId[];
}
