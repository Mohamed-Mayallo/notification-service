import { Module } from '@nestjs/common';
import { FirebaseProvider } from './providers/firebase.provider';
import { OneSignalProvider } from './providers/one-signal.provider';
import { PushService } from './push.service';

@Module({
  providers: [PushService, FirebaseProvider, OneSignalProvider],
  exports: [PushService, FirebaseProvider, OneSignalProvider]
})
export class PushModule {}
