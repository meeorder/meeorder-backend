import { AddonsService } from '@/addons/addons.service';
import { CouponsService } from '@/coupons/coupons.service';
import { MenusService } from '@/menus/menus.service';
import { OrdersService } from '@/orders/orders.service';
import { CouponSchema } from '@/schema/coupons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { SessionSchema } from '@/schema/session.schema';
import { UserSchema } from '@/schema/users.schema';
import { SessionService } from '@/session/session.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { getModelToken } from 'nest-typegoose';

describe('SessionService', () => {
  let sessionService: SessionService;
  const sessionModel: Partial<ReturnModelType<typeof SessionSchema>> = {};
  const userModel: Partial<ReturnModelType<typeof UserSchema>> = {};
  const couponModel: Partial<ReturnModelType<typeof CouponSchema>> = {};
  const menuService: Partial<MenusService> = {};
  const orderService: Partial<OrdersService> = {};
  const addonsService: Partial<AddonsService> = {};
  const couponsService: Partial<CouponsService> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        OrdersService,
        AddonsService,
        MenusService,
        CouponsService,
        {
          provide: getModelToken(SessionSchema.name),
          useValue: sessionModel,
        },
        {
          provide: getModelToken(UserSchema.name),
          useValue: userModel,
        },
        {
          provide: getModelToken(CouponSchema.name),
          useValue: couponModel,
        },
      ],
    })
      .overrideProvider(OrdersService)
      .useValue(orderService)
      .overrideProvider(MenusService)
      .useValue(menuService)
      .overrideProvider(AddonsService)
      .useValue(addonsService)
      .overrideProvider(CouponsService)
      .useValue(couponsService)
      .compile();

    sessionService = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(sessionService).toBeDefined();
  });

  describe('isRedeemableCoupon', () => {
    it('should redeemable if menu in required menu', () => {
      const menuIds = [
        new Types.ObjectId('64f598e7cecc358bef29d2f3'),
        new Types.ObjectId('64f598e7cecc358bef29d2f4'),
      ];
      const menus: Pick<MenuSchema, '_id'>[] = menuIds.map((id) => ({
        _id: id,
      }));
      const coupon: Pick<CouponSchema, 'required_menus' | 'required_point'> = {
        required_menus: [menuIds[0]],
        required_point: 100,
      };
      const user: Pick<UserSchema, 'point'> = {
        point: coupon.required_point,
      };

      expect(
        sessionService.isRedeemableCoupon(user, coupon, menus),
      ).toBeTruthy();
    });

    it('should unredeemable if menu not in required menu', () => {
      const menuIds = [
        new Types.ObjectId('64f598e7cecc358bef29d2f3'),
        new Types.ObjectId('64f598e7cecc358bef29d2f4'),
      ];
      const menus: Pick<MenuSchema, '_id'>[] = menuIds.map((id) => ({
        _id: id,
      }));
      const coupon: Pick<CouponSchema, 'required_menus' | 'required_point'> = {
        required_menus: [
          {
            _id: new Types.ObjectId('64f5d4a272bce55a73fa639a'),
          },
        ] as any,
        required_point: 100,
      };
      const user: Pick<UserSchema, 'point'> = {
        point: coupon.required_point,
      };

      expect(
        sessionService.isRedeemableCoupon(user, coupon, menus),
      ).toBeFalsy();
    });

    it('should unredeemable if point not enough', () => {
      const menuIds = [
        new Types.ObjectId('64f598e7cecc358bef29d2f3'),
        new Types.ObjectId('64f598e7cecc358bef29d2f4'),
      ];
      const menus: Pick<MenuSchema, '_id'>[] = menuIds.map((id) => ({
        _id: id,
      }));
      const coupon: Pick<CouponSchema, 'required_menus' | 'required_point'> = {
        required_menus: [
          {
            _id: menuIds[0],
          },
        ] as any,
        required_point: 100,
      };
      const user: Pick<UserSchema, 'point'> = {
        point: coupon.required_point - 1,
      };

      expect(
        sessionService.isRedeemableCoupon(user, coupon, menus),
      ).toBeFalsy();
    });
  });

  describe('getSessions', () => {
    describe('should called function with corrected parameter', () => {
      it('should called with {$ne: null} when finished is true ', async () => {
        sessionModel.find = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          orFail: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue([]),
        });
        await sessionService.getSessions(true);
        expect(sessionModel.find).toBeCalledWith({
          finished_at: { $ne: null },
          deleted_at: null,
        });
      });

      it('should called with null when finished is false ', async () => {
        sessionModel.find = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          orFail: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue([]),
        });
        await sessionService.getSessions(false);
        expect(sessionModel.find).toBeCalledWith({
          finished_at: null,
          deleted_at: null,
        });
      });
    });
  });
});
