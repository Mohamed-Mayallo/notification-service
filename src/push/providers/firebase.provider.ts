import { Injectable } from '@nestjs/common';
import { NotificationStatusEnum } from 'src/notification/notification.enum';
import { NotificationInput } from 'src/notification/notification.input';
import { IProviderStrategy, SendResponse } from 'src/notification/provider-strategy.interface';

@Injectable()
export class FirebaseProvider implements IProviderStrategy {
  async sendToSingle(input: NotificationInput): Promise<SendResponse> {
    console.log('sent to single by firebase');
    return { destination: input.destinations[0], status: NotificationStatusEnum.DELIVERED };
  }

  async sendToMulti(input: NotificationInput): Promise<SendResponse[]> {
    console.log('sent to multi by firebase');
    return input.destinations.reduce((tot, destination) => {
      tot.push({ destination, status: NotificationStatusEnum.DELIVERED });
      return tot;
    }, []);
  }
}
