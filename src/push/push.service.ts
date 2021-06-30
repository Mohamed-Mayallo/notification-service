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
import { FirebaseProvider } from './providers/firebase.provider';
import { OneSignalProvider } from './providers/one-signal.provider';

@Injectable()
export class PushService extends NotificationStrategy {
  private defaultProvider = NotificationProvidersEnum.FIREBASE_PUSHER;

  constructor(
    private configurationService: ConfigurationService,
    private oneSignalProvider: OneSignalProvider,
    private firebaseProvider: FirebaseProvider,
    private notificationRepository: NotificationRepository,
    @InjectQueue('PushNotifications') private pushNotificationsQueue: Queue
  ) {
    super();
  }

  async defineDefaultProviderAndQueueConfig(): Promise<IProviderStrategy> {
    await this.loadQueueConfiguration(this.configurationService);
    this.defaultProvider =
      (await this.configurationService.getDefaultPusherProvider()) as NotificationProvidersEnum;
    if (this.defaultProvider === NotificationProvidersEnum.ONE_SIGNAL_PUSHER)
      return this.oneSignalProvider;
    return this.firebaseProvider;
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
        type: NotificationTypeEnum.PUSH,
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
    await this.pushNotificationsQueue.add('PushNotificationsHandler', input, {
      delay: overrideQueueDelayInMS !== undefined ? overrideQueueDelayInMS : this.queueDelayInMS
    });
  }
}
