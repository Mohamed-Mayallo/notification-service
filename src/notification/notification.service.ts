import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotificationStrategy } from './notification-strategy.interface';
import { NotificationInput } from './notification.input';

@Injectable()
export class NotificationService {
  private notificationStrategy: NotificationStrategy;

  setNotificationStrategy(notificationStrategy: NotificationStrategy) {
    this.notificationStrategy = notificationStrategy;
  }

  async send(input: NotificationInput) {
    if (!this.notificationStrategy) throw new ForbiddenException();
    await this.notificationStrategy.send(input);
  }
}
