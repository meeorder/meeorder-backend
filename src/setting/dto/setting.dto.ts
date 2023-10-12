import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SettingDto {
  @ApiPropertyOptional({ type: String, description: 'Restaurant Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'Restaurant Logo' })
  @IsOptional()
  @IsString()
  logo?: string;
}
