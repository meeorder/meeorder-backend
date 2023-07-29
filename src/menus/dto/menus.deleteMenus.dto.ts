import { ApiProperty } from '@nestjs/swagger';

export class DeleteMenusDto {
  @ApiProperty()
  ids: string[];
}
