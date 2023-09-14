import { LoginResponseDto } from '@/auth/dto/login.response.dto';
import { DataTable } from '@cucumber/cucumber';
import { binding, given, then, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';

@binding([Workspace])
export class AuthStep {
  constructor(private readonly workspace: Workspace) {}

  @given('login as')
  async loginAs(dt: DataTable) {
    const req = dt.hashes()[0];
    const token = await this.workspace.jwtService.signAsync({
      id: req.id,
      username: req.username,
      role: +req.role,
    });
    this.workspace.setHeader('Authorization', `Bearer ${token}`);
  }

  @when('login with username {string} and password {string}')
  async login(username: string, password: string): Promise<LoginResponseDto> {
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/auth/login',
      {
        username,
        password,
      },
    );

    return this.workspace.response.data;
  }

  @then('cookie should have jwt-meeorder')
  cookieShouldHaveJwtMeeorder() {}

  @when('register with username {string} and password {string}')
  async register(username: string, password: string) {
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/auth/register',
      {
        username,
        password,
      },
    );
  }
}
