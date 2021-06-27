import { Injectable } from '@nestjs/common';
import { ConfigurationValueEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { NotificationStrategy } from 'src/notification/notification-strategy.interface';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';
import { FirebaseProvider } from './providers/firebase.provider';
import { OneSignalProvider } from './providers/one-signal.provider';

@Injectable()
export class PushService extends NotificationStrategy {
  constructor(
    private configurationService: ConfigurationService,
    private oneSignalProvider: OneSignalProvider,
    private firebaseProvider: FirebaseProvider
  ) {
    super();
  }

  async defineDefaultProvider(): Promise<IProviderStrategy> {
    const provider = await this.configurationService.getDefaultSmsProvider();
    if (provider === ConfigurationValueEnum.ONE_SIGNAL_PUSHER) return this.oneSignalProvider;
    return this.firebaseProvider;
  }
}
