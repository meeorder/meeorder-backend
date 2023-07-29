import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class UpdateResponseDto {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  modifiedCount: number;

  @ApiProperty()
  upsertedId: Types.ObjectId;

  @ApiProperty()
  upsertedCount: number;

  @ApiProperty()
  matchedCount: number;
}
