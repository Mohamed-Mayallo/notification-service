import { Injectable } from '@nestjs/common';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';

@Injectable()
export class FirebaseProvider implements IProviderStrategy {
  async sendToSingle(item: string): Promise<void> {
    console.log('sent to single by firebase');
  }

  async sendToMulti(items: string[]): Promise<void> {
    console.log('sent to multi by firebase');
  }
}
