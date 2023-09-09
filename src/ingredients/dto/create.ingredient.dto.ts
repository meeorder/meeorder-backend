import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({
    type: String,
    description: 'Ingredient title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: Boolean,
    description: 'Ingredient status',
    required: true,
  })
  available: boolean;
}
