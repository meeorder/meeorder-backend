import { ApiProperty } from '@nestjs/swagger';

export class TablesDto {
  @ApiProperty()
  table_number: number;
}
