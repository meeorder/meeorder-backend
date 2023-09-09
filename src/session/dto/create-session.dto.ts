import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateSessionDto {
  @ApiProperty({ type: String, description: 'Table ID', required: true })
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : null))
  table: Types.ObjectId;
}
