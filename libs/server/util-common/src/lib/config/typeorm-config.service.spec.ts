import { Test, TestingModule } from '@nestjs/testing';
import { TypeormConfigService } from './typeorm-config.service';

describe('TypeormConfigService', () => {
  let service: TypeormConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeormConfigService],
    }).compile();

    service = module.get<TypeormConfigService>(TypeormConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
