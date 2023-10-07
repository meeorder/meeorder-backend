import { TablesSchema } from '@/schema/tables.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TableUpdateRequestDto implements Pick<TablesSchema, 'title'> {
  @ApiProperty()
  @IsString()
  title: string;
}
