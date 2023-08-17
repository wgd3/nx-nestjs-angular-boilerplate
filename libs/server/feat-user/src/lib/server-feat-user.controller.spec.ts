import { UserOrmEntity } from '@libs/server/data-access';
import { ServerUtilMailerService } from '@libs/server/util-mailer';
import { mockMailerFactory } from '@libs/server/util-mailer/testing';
import { mockRepoFactory } from '@libs/server/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ServerFeatUserController } from './server-feat-user.controller';
import { ServerFeatUserService } from './server-feat-user.service';

describe('ServerFeatUserController', () => {
  let controller: ServerFeatUserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatUserService,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useFactory: mockRepoFactory,
        },
        {
          provide: ServerUtilMailerService,
          useFactory: mockMailerFactory,
        },
      ],
      controllers: [ServerFeatUserController],
    }).compile();

    controller = module.get(ServerFeatUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
