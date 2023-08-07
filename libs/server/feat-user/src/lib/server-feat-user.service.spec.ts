import { Test } from '@nestjs/testing';
import { ServerFeatUserService } from './server-feat-user.service';

describe('ServerFeatUserService', () => {
  let service: ServerFeatUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatUserService],
    }).compile();

    service = module.get(ServerFeatUserService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
