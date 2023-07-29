import { SessionSchema } from '@/schema/session.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
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

  async finishSession(id: Types.ObjectId) {
    const result = await this.sessionModel
      .updateOne(
        { _id: id, deleted_at: null },
        {
          finished_at: new Date(),
        },
      )
      .orFail()
      .exec();

    return result;
  }

  async getSessionByTable(table: number): Promise<DocumentType<SessionSchema>> {
    const session = await this.sessionModel
      .findOne({
        table,
        finished_at: null,
        deleted_at: null,
      })
      .exec();

    return session;
  }

  async getSessions(finished = false): Promise<DocumentType<SessionSchema>[]> {
    const sessions = await this.sessionModel
      .find({
        finished_at: finished ? { $ne: null } : null,
        deleted_at: null,
      })
      .exec();

    return sessions;
  }

  deleteSession(id: Types.ObjectId) {
    return this.sessionModel
      .updateOne({ _id: id, deleted_at: null }, { deleted_at: new Date() })
      .orFail()
      .exec();
  }

  async validateTableHasSession(table: number) {
    const doc = await this.getSessionByTable(table);
    if (doc) {
      throw new HttpException(
        `Table ${table} doesn't have an active session`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
