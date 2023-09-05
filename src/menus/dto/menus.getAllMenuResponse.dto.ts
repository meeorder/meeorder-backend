import { MenuDtoForAllMenu } from '@/menus/dto/menus.togetallMenu.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
export class GetAllMenuResponseDto {
  @ApiProperty({ type: () => CategorySchema })
  category: Ref<CategorySchema>;

  @ApiProperty({ type: () => MenuDtoForAllMenu, isArray: true })
  menus: MenuDtoForAllMenu[];
}
