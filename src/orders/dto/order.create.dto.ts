import { Orders } from '@/orders/class/orders';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, ValidateNested } from 'class-validator';
export class CreateOrderDto {
  @ApiProperty({ type: String, description: 'session is ObjectID' })
  @IsMongoId()
  session: string;

  @ApiProperty({ type: () => Orders, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Orders)
  orders: Orders[];
}
