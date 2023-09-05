import { MenuDtoForAllMenu } from '@/menus/dto/menus.togetallMenu.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
export class GetAllMenuResponseDto {
  @ApiProperty({ type: () => CategorySchema, description: "Menu's Category" })
  category: Ref<CategorySchema>;

  @ApiProperty({
    type: () => MenuDtoForAllMenu,
    isArray: true,
    description: 'Array of all menu in category',
  })
  menus: MenuDtoForAllMenu[];
}
