import { Injectable } from '@nestjs/common';
import { ConfigurationValueEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { INotificationStrategy } from 'src/notification/notification-strategy.interface';
import { NotificationInput } from 'src/notification/notification.input';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';
import { FirebaseProvider } from './providers/firebase.provider';
import { OneSignalProvider } from './providers/one-signal.provider';

@Injectable()
export class PushService implements INotificationStrategy {
  pusherProvider: IProviderStrategy;

  constructor(private configurationService: ConfigurationService) {}

  async send(input: NotificationInput): Promise<void> {
    await this.defineDefaultPusher();
    if (this.isMulti(input.items)) await this.sendToMulti(input.items);
    else await this.sendToSingle(input.items[0]);
  }

  // TODO: Rid of if statement
  private async defineDefaultPusher() {
    const defaultPusher = await this.configurationService.getDefaultPusherProvider();
    if (defaultPusher === ConfigurationValueEnum.ONE_SIGNAL_PUSHER)
      this.pusherProvider = new OneSignalProvider();
    else this.pusherProvider = new FirebaseProvider();
  }

  private isMulti(items: string[]): boolean {
    return !!items[1];
  }

  private async sendToSingle(item: string) {
    this.pusherProvider.sendToSingle(item);
  }

  private async sendToMulti(items: string[]) {
    this.pusherProvider.sendToMulti(items);
  }
}
