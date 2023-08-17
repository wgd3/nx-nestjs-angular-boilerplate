import { ServerFeatUserService } from '@libs/server/feat-user';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';

import { ServerFeatAuthService } from '../server-feat-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: randPassword(),
        }),
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      controllers: [GoogleAuthController],
      providers: [
        ServerFeatAuthService,
        GoogleAuthService,
        {
          provide: ServerFeatUserService,
          useValue: {
            createUser: jest.fn(() => null),
          },
        },
      ],
    }).compile();

    controller = module.get<GoogleAuthController>(GoogleAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
