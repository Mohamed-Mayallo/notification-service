import { Injectable } from '@nestjs/common';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { NotificationStrategy } from './notification-strategy.interface';
import { NotificationInput } from './notification.input';

@Injectable()
export class NotificationService {
  private strategy: NotificationStrategy;

  setNotificationStrategy(strategy: NotificationStrategy) {
    this.strategy = strategy;
  }

  async send(input: NotificationInput) {
    if (!this.strategy) throw new BaseHttpException('EN', 111);
    await this.strategy.send(input);
  }
}
