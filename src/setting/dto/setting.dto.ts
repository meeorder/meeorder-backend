import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SettingDto {
  @ApiPropertyOptional({ type: String, description: 'Restaurant Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'Restaurant Logo' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Point Ratio (in baht)',
    example: 200,
  })
  @IsOptional()
  @IsNumber()
  point_ratio?: number;
}
