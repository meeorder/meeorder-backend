import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class SessionUserUpdateDto {
  @ApiProperty()
  @Transform(({ value }) => new Types.ObjectId(value))
  user: Types.ObjectId;
}
