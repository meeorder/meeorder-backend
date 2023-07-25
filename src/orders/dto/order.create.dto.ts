import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class orders {
  @ApiProperty({ type: Types.ObjectId })
  @IsMongoId()
  menu: Types.ObjectId;
  @ApiProperty({ type: [Types.ObjectId] })
  @IsArray()
  @IsMongoId({ each: true })
  addons: Types.ObjectId[];
  @ApiProperty({ type: String })
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
