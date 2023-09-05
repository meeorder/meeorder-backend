import { ApiProperty } from '@nestjs/swagger';

export class TablesDto {
  @ApiProperty({ type: Number, description: 'Table number', required: true })
  table_number: number;
}
