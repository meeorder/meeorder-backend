import { OrdersService } from '@/orders/orders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    })
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
