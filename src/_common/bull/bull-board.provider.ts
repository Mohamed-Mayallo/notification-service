import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';

@Injectable()
export class QueueUIProvider {
  static router = null;
  constructor(
    @InjectQueue('PushNotifications') private pushNotificationsQueue: Queue,
    @InjectQueue('SmsNotifications') private smsNotificationsQueue: Queue
  ) {
    const { router } = createBullBoard([
      new BullAdapter(this.pushNotificationsQueue),
      new BullAdapter(this.smsNotificationsQueue)
    ]);
    QueueUIProvider.router = router;
  }
}
