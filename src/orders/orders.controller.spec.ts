import { OrdersService } from '@/orders/orders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

const json_mock = `{
  "session" : "64b95d8869ac259060ac2c6e",
  "orders" : [
      {
          "menu" : "64b963027d0c7729a48d8f67",
          "addons": ["64b963047d0c7729a48d8f6b","64b963047d0c7729a48d8f6b"],
          "additional_info": "yyyyyyyyyxxx"
      },        
      {
          "menu" : "64b963047d0c7729a48d8f6f",
          "addons": ["64b963047d0c7729a48d8f6b","64b963047d0c7729a48d8f6d"],
          "additional_info": "bbbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
  ]
}`;

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
