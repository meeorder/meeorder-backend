import { AddonsService } from '@/addons/addons.service';
import { OrdersService } from '@/orders/orders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

jest.mock('@/addons/addons.service');

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, AddonsService],
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
