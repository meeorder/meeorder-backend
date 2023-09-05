import { MenuDtoForAllMenu } from '@/menus/dto/menus.togetallMenu.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
export class GetAllMenuResponseDto {
  @ApiProperty({
    type: CategorySchema,
    description: "Menu's Category",
  })
  category: CategorySchema;

  @ApiProperty({
    type: () => MenuDtoForAllMenu,
    isArray: true,
    description: 'Array of all menu in category',
  })
  menus: MenuDtoForAllMenu[];
}
