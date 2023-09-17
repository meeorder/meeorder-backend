import { AddonsService } from '@/addons/addons.service';
import { IngredientsService } from '@/ingredients/ingredients.service';
import { OrdersService } from '@/orders/orders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

jest.mock('@/addons/addons.service');
jest.mock('@/ingredients/ingredients.service');

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, AddonsService, IngredientsService],
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
