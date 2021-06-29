import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationInput } from 'src/notification/notification.input';
import { SmsService } from './sms.service';

@Processor('SmsNotifications')
export class SmsNotificationsProcessor {
  constructor(private smsService: SmsService) {}

  @Process('SmsNotificationsHandler')
  async handle(job: Job) {
    const input: NotificationInput = job.data;
    await this.smsService.sendToMultiAndSaveLog(input);
  }
}
