import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';
import { SmsService } from './sms.service';

@Module({
  imports: [ConfigurationModule],
  providers: [SmsService, AwsSnsProvider, TwilioProvider],
  exports: [SmsService, AwsSnsProvider, TwilioProvider]
})
export class SmsModule {}
