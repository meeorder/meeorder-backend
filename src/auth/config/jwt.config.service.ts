import { Config } from '@/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    const privateKey = this.configService
      .get<string | undefined>(Config.MEEORDER_PRIVATE_KEY)
      ?.replace(/\\n/g, '\n')
      .trim();

    const publicKey = this.configService
      .get<string | undefined>(Config.MEEORDER_PUBLIC_KEY)
      ?.replace(/\\n/g, '\n')
      .trim();

    return {
      publicKey,
      privateKey,
      signOptions: {
        algorithm: 'ES256',
      },
      verifyOptions: {
        algorithms: ['ES256'],
      },
    };
  }
}
