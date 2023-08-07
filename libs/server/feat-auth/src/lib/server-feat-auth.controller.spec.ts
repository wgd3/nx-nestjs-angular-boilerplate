import { Test } from '@nestjs/testing';
import { ServerFeatAuthController } from './server-feat-auth.controller';
import { ServerFeatAuthService } from './server-feat-auth.service';

describe('ServerFeatAuthController', () => {
  let controller: ServerFeatAuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatAuthService],
      controllers: [ServerFeatAuthController],
    }).compile();

    controller = module.get(ServerFeatAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
