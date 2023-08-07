import { Test } from '@nestjs/testing';
import { ServerFeatAuthService } from './server-feat-auth.service';

describe('ServerFeatAuthService', () => {
  let service: ServerFeatAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatAuthService],
    }).compile();

    service = module.get(ServerFeatAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
