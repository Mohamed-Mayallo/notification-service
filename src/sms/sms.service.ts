import { Injectable } from '@nestjs/common';
import { ConfigurationValueEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { NotificationStrategy } from 'src/notification/notification-strategy.interface';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';

@Injectable()
export class SmsService extends NotificationStrategy {
  constructor(
    private configurationService: ConfigurationService,
    private twilioProvider: TwilioProvider,
    private awsSnsProvider: AwsSnsProvider
  ) {
    super();
  }

  async defineDefaultProvider(): Promise<IProviderStrategy> {
    const provider = await this.configurationService.getDefaultSmsProvider();
    if (provider === ConfigurationValueEnum.TWILIO_SMS) return this.twilioProvider;
    return this.awsSnsProvider;
  }
}
