import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { PushModule } from 'src/push/push.module';
import { SmsModule } from 'src/sms/sms.module';
import { NotificationController } from './notification.controller';
import { NotificationLog, NotificationLogSchema } from './notification.schema';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigurationModule,
    PushModule,
    SmsModule,
    MongooseModule.forFeature([{ name: NotificationLog.name, schema: NotificationLogSchema }])
  ],
  providers: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
