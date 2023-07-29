import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class Orders {
  @ApiProperty({ type: String, description: 'menu is ObjectID' })
  @IsMongoId()
  menu: string;

  @ApiProperty({
    type: String,
    description: 'Array of ObjectID',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  addons?: string[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  additional_info?: string;
}
