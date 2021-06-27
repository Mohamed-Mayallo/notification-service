import { NotificationStatusEnum } from './notification.enum';
import { NotificationInput } from './notification.input';

export type SendResponse = {
  status: NotificationStatusEnum;
  destination: string;
};

export interface IProviderStrategy {
  sendToSingle(input: NotificationInput): Promise<SendResponse>;
  sendToMulti(input: NotificationInput): Promise<SendResponse[]>;
}
