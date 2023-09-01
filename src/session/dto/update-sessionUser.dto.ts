import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class SessionUserUpdateDto {
  @ApiProperty()
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  user: Types.ObjectId;
}
