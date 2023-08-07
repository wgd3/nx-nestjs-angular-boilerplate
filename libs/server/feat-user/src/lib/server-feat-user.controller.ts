import { Controller } from '@nestjs/common';
import { ServerFeatUserService } from './server-feat-user.service';

@Controller('server-feat-user')
export class ServerFeatUserController {
  constructor(private serverFeatUserService: ServerFeatUserService) {}
}
