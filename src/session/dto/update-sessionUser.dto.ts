import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class SessionUserUpdateDto {
  @ApiProperty({ type: String, description: 'User ID', required: true })
  @Transform(({ value }) => new Types.ObjectId(value))
  user: Types.ObjectId;
}
