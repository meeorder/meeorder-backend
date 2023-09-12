import { MongoTransform } from '@/utils/mongo-transform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateSessionDto {
  @ApiProperty({ type: String, description: 'Table ID', required: true })
  @Transform(new MongoTransform(true).value())
  table: Types.ObjectId;
}
