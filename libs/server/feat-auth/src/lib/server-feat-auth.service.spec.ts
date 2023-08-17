import { ServerFeatUserService } from '@libs/server/feat-user';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';

import { ServerFeatAuthService } from './server-feat-auth.service';

describe('ServerFeatAuthService', () => {
  let service: ServerFeatAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: randPassword(),
        }),
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        ServerFeatAuthService,
        {
          provide: ServerFeatUserService,
          useValue: {
            createUser: jest.fn(() => null),
          },
        },
      ],
    }).compile();

    service = module.get(ServerFeatAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
