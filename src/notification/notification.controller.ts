import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
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
  async push(@Body() input: NotificationInput, @Res() res) {
    this.notificationService.setNotificationStrategy(this.pushService);
    await this.notificationService.send(input);
    res.json({ message: 'OK', statusCode: 200 });
  }

  private validateDestinationsAsPhoneNumbers(phoneNumbers: string[]) {
    return phoneNumbers.every(phone => isPhoneNumber(phone, null));
  }

  @Post('/sms')
  async sms(@Body() input: NotificationInput, @Res() res) {
    const isValidPhoneNumbers = this.validateDestinationsAsPhoneNumbers(input.destinations);
    if (!isValidPhoneNumbers) throw new BadRequestException('Not valid phone number');
    this.notificationService.setNotificationStrategy(this.smsService);
    await this.notificationService.send(input);
    res.json({ message: 'OK', statusCode: 200 });
  }
}
