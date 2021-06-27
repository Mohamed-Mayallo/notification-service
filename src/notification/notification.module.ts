import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { PushModule } from 'src/push/push.module';
import { SmsModule } from 'src/sms/sms.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigurationModule, PushModule, SmsModule],
  providers: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
