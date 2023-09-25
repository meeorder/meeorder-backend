import { MongoTransform } from '@/utils/mongo-transform';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CancelOrderDto {
  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'Ingredients that out of stock (not implemented yet)',
    default: [],
  })
  @IsOptional()
  @Transform(new MongoTransform().array())
  ingredients: Types.ObjectId[] = [];

  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'Addons that out of stock',
    default: [],
  })
  @IsOptional()
  @Transform(new MongoTransform().array())
  addons: Types.ObjectId[] = [];

  @ApiProperty({ default: null, description: 'Reason for cancel order' })
  reason: string = null;
}
