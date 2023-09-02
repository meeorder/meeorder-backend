import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ type: Number, description: 'Table ID', required: true })
  @IsNumber()
  table: number;
}
