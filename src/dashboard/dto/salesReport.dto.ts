import { ApiProperty } from '@nestjs/swagger';

export class SaleReportDto {
  @ApiProperty({
    description: 'Menu ID',
    type: String,
    required: true,
  })
  menu_id: string;

  @ApiProperty({
    description: 'Menu title',
    type: String,
    required: true,
  })
  menu_title: string;

  @ApiProperty({
    description: 'Menu category',
    type: String,
    required: true,
  })
  menu_category: string;

  @ApiProperty({
    description: 'Menu sold amount',
    type: Number,
    required: true,
  })
  total_amount: number;

  @ApiProperty({
    description: 'Menu total price',
    type: Number,
    required: true,
  })
  total_price: number;
}
