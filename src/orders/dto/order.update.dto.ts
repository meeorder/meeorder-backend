import { AddonSchema } from '@/schema/addons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

export class UpdateOrderDto {
  @ApiProperty({ type: String, isArray: true })
  addons: Ref<AddonSchema>[];

  @ApiProperty({ type: String })
  additional_info: string;
}
