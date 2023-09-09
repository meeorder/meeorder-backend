import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateIngredientDto {
  @ApiProperty({
    type: String,
    description: 'Ingredient title',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Ingredient status',
    required: false,
  })
  @IsOptional()
  available: boolean;
}
