import { SessionSchema } from '@/schema/session.schema';
import { SessionService } from '@/session/session.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'nest-typegoose';

describe('SessionService', () => {
  let sessionService: SessionService;
  const sessionModel: Partial<ReturnModelType<typeof SessionSchema>> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getModelToken(SessionSchema.name),
          useValue: sessionModel,
        },
      ],
    }).compile();

    sessionService = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(sessionService).toBeDefined();
  });

  describe('getSessions', () => {
    describe('should called function with corrected parameter', () => {
      it('should called with {$ne: null} when finished is true ', async () => {
        sessionModel.find = jest.fn().mockReturnValue({
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
