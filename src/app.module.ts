import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { NotificationModule } from './notification/notification.module';
import { NestBullModule } from './_common/bull/bull.module';
import { DatabaseModule } from './_common/database/database.module';
import { HttpExceptionFilter } from './_common/exceptions/exception-filter';
import { ValidationPipe } from './_common/exceptions/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    NotificationModule,
    NestBullModule
  ],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter }
  ]
})
export class AppModule {}
