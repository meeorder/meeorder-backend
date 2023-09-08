import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({
    type: String,
    description: 'Ingredient title',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Boolean,
    description: 'Ingredient status',
    required: true,
  })
  available: boolean;
}
