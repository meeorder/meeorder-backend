import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator';

export class Orders {
  @ApiProperty({ type: String, description: 'menu is ObjectID' })
  @IsMongoId()
  menu: string;
  @ApiProperty({ type: String, description: 'Array of ObjectID' })
  @IsArray()
  @IsMongoId({ each: true })
  addons: string[];
  @ApiProperty({ type: String })
  @IsString()
  additional_info: string;
}
export class CreateOrderDto {
  @ApiProperty({ type: String, description: 'session is ObjectID' })
  @IsMongoId()
  session: string;
  @ApiProperty({ type: () => [Orders] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Orders)
  orders: Orders[];
}
