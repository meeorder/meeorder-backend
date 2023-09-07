import { ApiProperty } from '@nestjs/swagger';

export class TablesDto {
  @ApiProperty({ type: String, description: 'Table number', required: true })
  title: string;
}
