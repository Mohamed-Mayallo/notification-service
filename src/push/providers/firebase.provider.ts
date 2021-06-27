import { Injectable } from '@nestjs/common';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';

@Injectable()
export class FirebaseProvider implements IProviderStrategy {
  async sendToSingle(destination: string): Promise<void> {
    console.log('sent to single by firebase');
  }

  async sendToMulti(destinations: string[]): Promise<void> {
    console.log('sent to multi by firebase');
  }
}
