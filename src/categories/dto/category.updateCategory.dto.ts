import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ isArray: true })
  @IsString()
  menu: string;

  @ApiProperty()
  @IsNumber()
  rank: number;
}
