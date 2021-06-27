import { NotificationInput } from './notification.input';

export interface INotificationStrategy {
  send(input: NotificationInput): Promise<void>;
}
