import { HealthSchema } from '@/schema/health.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelForClass } from '@typegoose/typegoose';
import { getModelToken } from 'nest-typegoose';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  const healthModel = getModelForClass(HealthSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getModelToken(HealthSchema.name),
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
