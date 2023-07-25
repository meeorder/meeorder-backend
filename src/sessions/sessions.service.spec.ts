import { OrdersService } from '@/orders/orders.service';
import { SessionsService } from '@/sessions/sessions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

describe('SessionsService', () => {
  let sessionsService: SessionsService;
  const orderService: Partial<OrdersService> = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService, OrdersService],
    })
      .overrideProvider(OrdersService)
      .useValue(orderService)
      .compile();
    sessionsService = module.get<SessionsService>(SessionsService);
  });
  it('should be defined', () => {
    expect(sessionsService).toBeDefined();
  });
  it('total-discount=netprice', async () => {
    orderService.findBySessionId = jest.fn().mockResolvedValue({
      session: new Types.ObjectId(),
      orders: [
        {
          menu: new Types.ObjectId(),
          addons: [new Types.ObjectId()],
          additional_info: '',
        },
        {
          menu: new Types.ObjectId(),
          addons: [new Types.ObjectId()],
          additional_info: '',
        },
      ],
    });
    const result = await sessionsService.listOrderBySession(
      new Types.ObjectId().toHexString(),
    );
    expect(result.total_price - result.discount_price).toEqual(
      result.net_price,
    );
  });
});
