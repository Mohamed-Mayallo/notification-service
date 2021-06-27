import { Injectable } from '@nestjs/common';
import { NotificationStatusEnum } from 'src/notification/notification.enum';
import { NotificationInput } from 'src/notification/notification.input';
import { IProviderStrategy, SendResponse } from 'src/notification/provider-strategy.interface';

@Injectable()
export class TwilioProvider implements IProviderStrategy {
  async sendToSingle(input: NotificationInput): Promise<SendResponse> {
    console.log('sent to single by twilio');
    return { destination: input.destinations[0], status: NotificationStatusEnum.DELIVERED };
  }

  async sendToMulti(input: NotificationInput): Promise<SendResponse[]> {
    console.log('sent to multi by twilio');
    return input.destinations.reduce((tot, destination) => {
      tot.push({ destination, status: NotificationStatusEnum.DELIVERED });
      return tot;
    }, []);
  }
}
