import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationInput } from 'src/notification/notification.input';
import { PushService } from './push.service';

@Processor('PushNotifications')
export class PushNotificationsProcessor {
  constructor(private pushService: PushService) {}

  @Process('PushNotificationsHandler')
  async handle(job: Job) {
    const input: NotificationInput = job.data;
    await this.pushService.sendToMultiAndSaveLog(input);
  }
}
