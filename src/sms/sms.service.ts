import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigurationValueEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { NotificationStrategy } from 'src/notification/notification-strategy.interface';
import { NotificationTypeEnum } from 'src/notification/notification.enum';
import { NotificationInput } from 'src/notification/notification.input';
import { NotificationLog, NotificationLogDocument } from 'src/notification/notification.schema';
import { IProviderStrategy, SendResponse } from 'src/notification/provider-strategy.interface';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';

@Injectable()
export class SmsService extends NotificationStrategy {
  constructor(
    private configurationService: ConfigurationService,
    private twilioProvider: TwilioProvider,
    private awsSnsProvider: AwsSnsProvider,
    @InjectModel(NotificationLog.name) private notificationLogModel: Model<NotificationLogDocument>
  ) {
    super();
  }

  async defineDefaultProvider(): Promise<IProviderStrategy> {
    const provider = await this.configurationService.getDefaultSmsProvider();
    if (provider === ConfigurationValueEnum.TWILIO_SMS) return this.twilioProvider;
    return this.awsSnsProvider;
  }

  async saveLog(input: NotificationInput, response: SendResponse) {
    await this.notificationLogModel.create({
      destination: response.destination,
      status: response.status,
      type: NotificationTypeEnum.SMS,
      notificationLang: input.favoriteLang,
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
