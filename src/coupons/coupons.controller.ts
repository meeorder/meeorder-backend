import { CouponSchema } from '@/schema/coupons.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch as Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    type: () => CouponSchema,
  })
  @ApiOperation({
    summary: 'Create a coupon',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponsService.createCoupon(createCouponDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => CouponSchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all coupons (Owner)',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.couponsService.getAllCouponByOwner();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => CouponSchema,
  })
  @ApiOperation({
    summary: 'Get a coupon by id',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.couponsService.getCouponByIdByOwner(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon updated',
    type: () => CouponSchema,
  })
  @ApiOperation({
    summary: 'Update a coupon by id',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return await this.couponsService.updateCoupon(id, updateCouponDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon deleted',
  })
  @ApiOperation({
    summary: 'Delete a coupon by id',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.couponsService.deleteCoupon(id);
  }
}
