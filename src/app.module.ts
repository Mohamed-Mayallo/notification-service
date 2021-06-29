import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { NestBullModule } from './_common/bull/bull.module';
import { DatabaseModule } from './_common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    NotificationModule,
    NestBullModule
  ]
})
export class AppModule {}
