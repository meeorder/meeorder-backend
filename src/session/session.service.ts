import { SessionSchema } from '@/schema/session.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SessionSchema)
    private readonly sessionModel: ReturnModelType<typeof SessionSchema>,
  ) {}

  async createSession(table: number, uid?: string) {
    const session = await this.sessionModel.create({
      table,
      uid,
    });

    return session;
  }

  async finishSession(sessionId: string) {
    const result = await this.sessionModel
      .updateOne(
        { _id: sessionId },
        {
          finished_at: new Date(),
        },
      )
      .exec();

    return result;
  }

  async getSessionByTable(table: number) {
    const session = await this.sessionModel
      .findOne({
        table,
        finished_at: null,
      })
      .exec();

    return session;
  }
}
