import { SessionSchema } from '@/schema/session.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class SessionStepDefination {
  private readonly sessionModel: ReturnModelType<typeof SessionSchema>;

  constructor(private readonly workspace: Workspace) {
    this.sessionModel = this.workspace.datasource.getModel(SessionSchema);
  }

  @given('sessions')
  async givenSessions(dt: DataTable) {
    const sessions = dt.hashes();
    for (const session of sessions) {
      const doc = await this.sessionModel.create({
        table: +session.table,
        uid: session.uid ?? null,
        _id: new Types.ObjectId(session._id),
        finished_at: session.finished_at ? new Date(session.finished_at) : null,
      });

      expect(doc._id.toHexString()).toBe(session._id);
    }
  }

  @when('create session')
  async createSession(dt: DataTable) {
    const session = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/sessions',
      {
        table: +session.table,
        uid: session.uid,
      },
    );
  }

  @when('get all sessions')
  async getAllSessions() {
    this.workspace.response =
      await this.workspace.axiosInstance.get('/sessions');
  }

  @when('finish session {string}')
  async finishSession(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/sessions/${id}/finish`,
    );
  }

  @when('list sessions with finished {string}')
  async listSessions(finished: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/sessions?finished=${finished}`,
    );
  }

  @when('get session by table {int}')
  async getSession(id: number) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/sessions/table/${id}`,
    );
  }

  @when('get session {string}')
  async getSessionById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/sessions/${id}`,
    );
  }

  @then('should session appear in database')
  async shouldSessionAppearInDatabase() {
    const session = await this.sessionModel.findById(
      this.workspace.response.data._id,
    );
    expect(session).toBeTruthy();
  }

  @then('should session {string} update to finished')
  async shouldSessionUpdateToFinished(id: string) {
    const session = await this.sessionModel.findById(new Types.ObjectId(id));
    expect(session.finished_at).not.toBeNull();
  }

  @then('should not finished session appear')
  shouldNotFinishedSessionAppear() {
    const responseData = <SessionSchema[]>this.workspace.response.data;
    for (const data of responseData) {
      expect(data.finished_at).toBeNull();
    }
  }

  @after()
  async cleanUpDb() {
    await this.sessionModel.deleteMany({});
  }
}
