import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
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
    private notificationRepository: NotificationRepository,
    @InjectQueue('SmsNotifications') private smsNotificationsQueue: Queue
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

  async productNotificationsQueue(input: NotificationInput, overrideQueueDelayInMS?: number) {
    await this.smsNotificationsQueue.add('SmsNotificationsHandler', input, {
      delay: overrideQueueDelayInMS !== undefined ? overrideQueueDelayInMS : this.queueDelayInMS
    });
  }
}
