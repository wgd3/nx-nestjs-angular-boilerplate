import { Repository } from 'typeorm';

import { UserOrmEntity } from '@libs/server/data-access';
import { ServerUtilMailerService } from '@libs/server/util-mailer';
import { mockMailerFactory } from '@libs/server/util-mailer/testing';
import { mockRepoFactory, MockType } from '@libs/server/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ServerFeatUserService } from './server-feat-user.service';

describe('ServerFeatUserService', () => {
  let service: ServerFeatUserService;
  let repoMock: MockType<Repository<UserOrmEntity>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatUserService,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useFactory: mockRepoFactory,
        },
        { provide: ServerUtilMailerService, useFactory: mockMailerFactory },
      ],
    }).compile();

    service = module.get(ServerFeatUserService);
    repoMock = module.get(getRepositoryToken(UserOrmEntity));
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
    expect(repoMock).toBeTruthy();
  });
});
