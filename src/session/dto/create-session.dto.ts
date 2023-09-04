import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSessionDto {
  @ApiProperty({ type: String, description: 'User ID', required: false })
  @IsOptional()
  @IsUUID()
  uid?: string;

  @ApiProperty({ type: String, description: 'Table ID', required: true })
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : null))
  table: Types.ObjectId;
}
