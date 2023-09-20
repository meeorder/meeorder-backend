import { CategorySchema } from '@/schema/categories.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

export class PopulatedCategoryMenuDto extends MenuSchema {
  @ApiProperty({ type: () => CategorySchema })
  category: Ref<CategorySchema>;
}
