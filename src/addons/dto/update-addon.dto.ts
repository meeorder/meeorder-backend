import { CreateAddonDto } from '@/addons/dto/addon.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAddonDto extends CreateAddonDto {
  @ApiProperty()
  @IsBoolean()
  available: boolean;
}
