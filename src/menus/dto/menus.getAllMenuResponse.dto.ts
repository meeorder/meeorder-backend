import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
export class GetAllMenuResponseDto {
  @ApiProperty({ type: CategorySchema })
  category: CategorySchema;

  @ApiProperty({ type: GetMenuByIdResponseDto, isArray: true })
  menus: GetMenuByIdResponseDto[];
}
