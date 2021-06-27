import { Injectable } from '@nestjs/common';
import { INotificationStrategy } from './notification-strategy.interface';
import { NotificationInput } from './notification.input';

@Injectable()
export class NotificationService {
  private strategy: INotificationStrategy;

  constructor(strategy: INotificationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: INotificationStrategy) {
    this.strategy = strategy;
  }

  async send(input: NotificationInput) {
    await this.strategy.send(input);
  }
}
