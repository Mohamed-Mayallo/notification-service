import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { FirebaseProvider } from './providers/firebase.provider';
import { OneSignalProvider } from './providers/one-signal.provider';
import { PushNotificationsProcessor } from './push.processor';
import { PushService } from './push.service';

@Module({
  imports: [ConfigurationModule],
  providers: [PushService, FirebaseProvider, OneSignalProvider, PushNotificationsProcessor],
  exports: [PushService, FirebaseProvider, OneSignalProvider]
})
export class PushModule {}
