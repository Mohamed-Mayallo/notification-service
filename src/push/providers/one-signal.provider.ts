import { Injectable } from '@nestjs/common';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';

@Injectable()
export class OneSignalProvider implements IProviderStrategy {
  async sendToSingle(destination: string): Promise<void> {
    console.log('sent to single by one signal');
  }

  async sendToMulti(destinations: string[]): Promise<void> {
    console.log('sent to multi by one signal');
  }
}