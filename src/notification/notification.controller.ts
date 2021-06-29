import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { isPhoneNumber } from 'class-validator';
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
    const isValidPhoneNumbers = this.validateDestinationsAsPhoneNumbers(input.destinations);
    if (!isValidPhoneNumbers) throw new BadRequestException();
    this.notificationService.setNotificationStrategy(this.pushService);
    await this.notificationService.send(input);
  }

  private validateDestinationsAsPhoneNumbers(phoneNumbers: string[]) {
    return phoneNumbers.every(phone => isPhoneNumber(phone, null));
  }

  @Post('/sms')
  async sms(@Body() input: NotificationInput) {
    this.notificationService.setNotificationStrategy(this.smsService);
    await this.notificationService.send(input);
  }
}
