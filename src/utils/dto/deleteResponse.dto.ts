import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  deletedCount: number;
}
