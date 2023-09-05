import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Category title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
