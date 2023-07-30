import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ type: String, description: 'User ID', required: false })
  @IsOptional()
  @IsUUID()
  uid?: string;

  @ApiProperty({ type: Number, description: 'Table ID', required: true })
  @IsNumber()
  table: number;
}
