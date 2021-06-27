import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DB_USER')}:${configService.get(
          'DB_PASS'
        )}@${configService.get('DB_HOST')}:${configService.get('DB_PORT')}/${configService.get(
          'DB_NAME'
        )}`
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
