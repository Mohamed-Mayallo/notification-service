import { Global, Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { databaseModels, databaseRepositories } from './database.repositories';

@Global()
@Module({
  imports: [databaseProvider, databaseModels],
  providers: [...databaseRepositories],
  exports: [...databaseRepositories]
})
export class DatabaseModule {}
