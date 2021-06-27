import { Injectable } from '@nestjs/common';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { NotificationStrategy } from './notification-strategy.interface';
import { NotificationInput } from './notification.input';

@Injectable()
export class NotificationService {
  private notificationStrategy: NotificationStrategy;

  setNotificationStrategy(notificationStrategy: NotificationStrategy) {
    this.notificationStrategy = notificationStrategy;
  }

  async send(input: NotificationInput) {
    if (!this.notificationStrategy) throw new BaseHttpException('EN', 600);
    await this.notificationStrategy.send(input);
  }
}
