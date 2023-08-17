import { NestFactory } from '@nestjs/core';

import { SeedModule } from './seed.module';
import { UserDatabaseSeedService } from './users.database-seed';

const seedDatabase = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(UserDatabaseSeedService).seed();
  await app.get(UserDatabaseSeedService).populateRandomUsers(20);

  await app.close();
};

void seedDatabase();
