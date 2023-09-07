import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class DisableAddonsDto {
  @ApiProperty({
    type: String,
    description: 'addons is ObjectID',
    isArray: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  addonsList: string[];
}
