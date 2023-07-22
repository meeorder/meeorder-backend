import { ApiProperty } from '@nestjs/swagger';
import { CategoryClass } from 'src/schema/categories.schema';

export class CreateCategoryDto{
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;
}