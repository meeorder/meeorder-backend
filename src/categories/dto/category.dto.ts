import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
