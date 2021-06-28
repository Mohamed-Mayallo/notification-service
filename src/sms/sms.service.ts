import { Injectable } from '@nestjs/common';
import { ConfigurationValueEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { NotificationStrategy } from 'src/notification/notification-strategy.interface';
import { NotificationTypeEnum } from 'src/notification/notification.enum';
import { NotificationInput } from 'src/notification/notification.input';
import { NotificationRepository } from 'src/notification/notification.repository';
import { IProviderStrategy, SendResponse } from 'src/notification/provider-strategy.interface';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';

@Injectable()
export class SmsService extends NotificationStrategy {
  constructor(
    private configurationService: ConfigurationService,
    private twilioProvider: TwilioProvider,
    private awsSnsProvider: AwsSnsProvider,
    private notificationRepository: NotificationRepository
  ) {
    super();
  }

  async defineDefaultProvider(): Promise<IProviderStrategy> {
    const provider = await this.configurationService.getDefaultSmsProvider();
    if (provider === ConfigurationValueEnum.TWILIO_SMS) return this.twilioProvider;
    return this.awsSnsProvider;
  }

  async saveLog(input: NotificationInput, response: SendResponse) {
    await this.notificationRepository.createOne({
      destination: response.destination,
      status: response.status,
      type: NotificationTypeEnum.SMS,
      notificationLang: input.favoriteLang,
      createdAt: new Date(),
      retries: 1,
      notificationContent: {
        arBody: input.arBody,
        enBody: input.enBody,
        arSubject: input.arSubject,
        enSubject: input.enSubject
      }
    });
  }
}
