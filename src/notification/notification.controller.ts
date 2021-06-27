import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from 'src/push/push.service';
import { SmsService } from 'src/sms/sms.service';
import { NotificationInput } from './notification.input';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private pushService: PushService,
    private smsService: SmsService
  ) {}

  @Post('/push')
  async push(@Body() input: NotificationInput) {
    this.notificationService.setStrategy(this.pushService);
    await this.notificationService.send(input);
  }

  @Post('/sms')
  async sms(@Body() input: NotificationInput) {
    this.notificationService.setStrategy(this.smsService);
    await this.notificationService.send(input);
  }
}
