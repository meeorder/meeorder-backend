import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { getModelToken } from '@nestjs/mongoose';
import { HealthClass, HealthSchema } from '@/schema/health.schema';
import { model } from 'mongoose';

describe('HealthService', () => {
  let service: HealthService;
  const healthModel = model(HealthClass.name, HealthSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getModelToken(HealthClass.name),
          useValue: healthModel,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRecord', () => {
    it('should return created date', async () => {
      const expectedDate = new Date();
      healthModel.create = jest.fn().mockResolvedValue({
        createdAt: expectedDate,
        toObject: jest.fn().mockReturnThis(),
      });
      const result = await service.createRecord();
      expect(result.createdAt).toBe(expectedDate);
    });
  });
});
