import { Controller } from '@nestjs/common';
import { ServerFeatAuthService } from './server-feat-auth.service';

@Controller('server-feat-auth')
export class ServerFeatAuthController {
  constructor(private serverFeatAuthService: ServerFeatAuthService) {}
}
