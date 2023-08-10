import { Test } from '@nestjs/testing';
import { ServerUtilMailerService } from './server-util-mailer.service';

describe('ServerUtilMailerService', () => {
  let service: ServerUtilMailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerUtilMailerService],
    }).compile();

    service = module.get(ServerUtilMailerService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
