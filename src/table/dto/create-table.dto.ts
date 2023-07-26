import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTableDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
