import { Test } from '@nestjs/testing';
import { ServerFeatUserController } from './server-feat-user.controller';
import { ServerFeatUserService } from './server-feat-user.service';

describe('ServerFeatUserController', () => {
  let controller: ServerFeatUserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatUserService],
      controllers: [ServerFeatUserController],
    }).compile();

    controller = module.get(ServerFeatUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
