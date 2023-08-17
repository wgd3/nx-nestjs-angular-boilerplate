import { ServerFeatUserService } from '@libs/server/feat-user';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';

import { ServerFeatAuthController } from './server-feat-auth.controller';
import { ServerFeatAuthService } from './server-feat-auth.service';

describe('ServerFeatAuthController', () => {
  let controller: ServerFeatAuthController;

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
      controllers: [ServerFeatAuthController],
    }).compile();

    controller = module.get(ServerFeatAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
