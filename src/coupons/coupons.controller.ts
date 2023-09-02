import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller({ path: 'coupons', version: '1' })
@ApiTags('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Coupon created',
    type: () => CreateCouponDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponsService.createCoupon(createCouponDto);
  }

  @Get()
  async findAll() {
    return await this.couponsService.getAllCouponByOwner();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.couponsService.getCouponByIdByOwner(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return await this.couponsService.updateCoupon(id, updateCouponDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.couponsService.deleteCoupon(id);
  }
}
