import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterResponseDto {
  @ApiProperty({ type: String, description: '_id is ObjectID' })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ type: String, description: 'username is string' })
  @IsString()
  username: string;
}
