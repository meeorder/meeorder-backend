import { Role } from '@/decorator/roles.decorator';
import { CouponSchema } from '@/schema/coupons.schema';
import { UserRole } from '@/schema/users.schema';
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller({ path: 'coupons', version: '1' })
@ApiTags('coupons')
@ApiBearerAuth()
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Coupon created',
    type: () => CreateCouponDto,
  })
  @ApiOperation({
    summary: 'Create a coupon',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Role(UserRole.Owner)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.createCoupon(createCouponDto);
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
  @Role(UserRole.Owner)
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
  @Role(UserRole.Owner)
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
  @Role(UserRole.Owner)
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
  @Role(UserRole.Owner)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.couponsService.deleteCoupon(id);
  }
}
