import { OrderStatus } from '@/orders/enums/orders.status';
import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { SessionSchema } from './../../schema/session.schema';

export class OrderGetDto {
  @ApiProperty({ type: String, description: 'Orders ID' })
  @IsMongoId()
  '_id': Types.ObjectId;

  @ApiProperty({ type: Date })
  @IsDate()
  created_at: Date;

  @ApiProperty({ type: String, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ type: [String], description: 'Array of MenuID' })
  @IsArray()
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  addons: Types.ObjectId[];

  @ApiProperty({ type: String, description: 'Additional info' })
  @IsString()
  additional_info: string;

  @ApiProperty({ type: Date, description: 'for cancel status' })
  @IsDate()
  cancelled_at: Date;

  @ApiProperty({ type: SessionSchema })
  @Type(() => SessionSchema)
  session: SessionSchema;

  @ApiProperty({ type: MenuSchema })
  @Type(() => MenuSchema)
  menu: MenuSchema;
}
