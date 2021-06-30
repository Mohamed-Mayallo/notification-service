import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { NotificationProvidersEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { NotificationStrategy } from 'src/notification/notification-strategy.interface';
import { NotificationTypeEnum } from 'src/notification/notification.enum';
import { NotificationInput } from 'src/notification/notification.input';
import { NotificationRepository } from 'src/notification/notification.repository';
import { NotificationLog } from 'src/notification/notification.schema';
import { IProviderStrategy, SendResponse } from 'src/notification/provider-strategy.interface';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';

@Injectable()
export class SmsService extends NotificationStrategy {
  private defaultProvider = NotificationProvidersEnum.AWS_SNS_SMS;

  constructor(
    private configurationService: ConfigurationService,
    private twilioProvider: TwilioProvider,
    private awsSnsProvider: AwsSnsProvider,
    private notificationRepository: NotificationRepository,
    @InjectQueue('SmsNotifications') private smsNotificationsQueue: Queue
  ) {
    super();
  }

  async defineDefaultProviderAndQueueConfig(): Promise<IProviderStrategy> {
    await this.loadQueueConfiguration(this.configurationService);
    this.defaultProvider =
      (await this.configurationService.getDefaultSmsProvider()) as NotificationProvidersEnum;
    if (this.defaultProvider === NotificationProvidersEnum.TWILIO_SMS) return this.twilioProvider;
    return this.awsSnsProvider;
  }

  async saveLog(input: NotificationInput, response: SendResponse) {
    const notificationDetails = this.getDbFieldsFromInputAndRes(input, [response]);
    await this.notificationRepository.createOne(notificationDetails[0]);
  }

  async saveMultiLog(input: NotificationInput, response: SendResponse[]) {
    const notificationsDetails = this.getDbFieldsFromInputAndRes(input, response);
    await this.notificationRepository.createMany(notificationsDetails);
  }

  private getDbFieldsFromInputAndRes(
    input: NotificationInput,
    response: SendResponse[]
  ): NotificationLog[] {
    return input.destinations.reduce((tot, destination) => {
      let responseStatus = response.find(obj => obj.destination === destination).status;
      tot.push({
        destination,
        status: responseStatus,
        type: NotificationTypeEnum.SMS,
        notificationLang: input.favoriteLang,
        createdAt: new Date(),
        providerName: this.defaultProvider,
        retries: 1,
        notificationContent: {
          arBody: input.arBody,
          enBody: input.enBody,
          arSubject: input.arSubject,
          enSubject: input.enSubject
        }
      });
      return tot;
    }, []);
  }

  async produceNotificationsQueue(input: NotificationInput, overrideQueueDelayInMS?: number) {
    await this.smsNotificationsQueue.add('SmsNotificationsHandler', input, {
      delay: overrideQueueDelayInMS !== undefined ? overrideQueueDelayInMS : this.queueDelayInMS
    });
  }
}
