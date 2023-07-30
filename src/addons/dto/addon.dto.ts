import { ApiProperty } from '@nestjs/swagger';

export class CreateAddonDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;
}
