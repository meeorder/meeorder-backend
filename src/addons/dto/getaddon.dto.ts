import { AddonSchema } from '@/schema/addons.schema';
import { ApiProperty } from '@nestjs/swagger';

export class GetAddonDto extends AddonSchema {
  @ApiProperty()
  menus_applied: number;

  constructor(addon: AddonSchema, menus_applied: number) {
    super();
    Object.assign(this, addon);
    this.menus_applied = menus_applied;
  }
}
