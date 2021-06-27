import { Module } from '@nestjs/common';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';
import { SmsService } from './sms.service';

@Module({
  providers: [SmsService, AwsSnsProvider, TwilioProvider],
  exports: [SmsService, AwsSnsProvider, TwilioProvider]
})
export class SmsModule {}
