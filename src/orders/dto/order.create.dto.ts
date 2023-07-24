import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

class orders {
  @IsMongoId()
  menu: Types.ObjectId;
  @IsArray()
  @IsMongoId({ each: true })
  addons: Types.ObjectId[];
  @IsString()
  additional_info: string;
}
export class CreateOrderDto {
  @ApiProperty({ type: Types.ObjectId })
  @IsMongoId()
  session: Types.ObjectId;
  @ApiProperty({ type: [orders] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => orders)
  orders: orders[];
}
