import { Config } from '@/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      publicKey: this.configService.get<string>(Config.MEEORDER_PUBLIC_KEY),
      privateKey: this.configService.get<string>(Config.MEEORDER_PRIVATE_KEY),
      signOptions: {
        algorithm: 'ES256',
      },
      verifyOptions: {
        algorithms: ['ES256'],
      },
    };
  }
}
