import { Injectable } from '@nestjs/common';
import { ConfigurationValueEnum } from 'src/configuration/configuration.enum';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { INotificationStrategy } from 'src/notification/notification-strategy.interface';
import { NotificationInput } from 'src/notification/notification.input';
import { IProviderStrategy } from 'src/notification/provider-strategy.interface';
import { AwsSnsProvider } from './providers/aws-sns.provider';
import { TwilioProvider } from './providers/twilio.provider';

@Injectable()
export class SmsService implements INotificationStrategy {
  private smsProvider: IProviderStrategy;

  constructor(private configurationService: ConfigurationService) {}

  async send(input: NotificationInput): Promise<void> {
    await this.defineDefaultPusher();
    if (this.isMulti(input.items)) await this.sendToMulti(input.items);
    else await this.sendToSingle(input.items[0]);
  }

  // TODO: Rid of if statement
  private async defineDefaultPusher() {
    const defaultPusher = await this.configurationService.getDefaultPusherProvider();
    if (defaultPusher === ConfigurationValueEnum.AWS_SNS) this.smsProvider = new AwsSnsProvider();
    else this.smsProvider = new TwilioProvider();
  }

  private isMulti(items: string[]): boolean {
    return !!items[1];
  }

  private async sendToSingle(item: string) {
    await this.smsProvider.sendToSingle(item);
  }

  private async sendToMulti(items: string[]) {
    await this.smsProvider.sendToMulti(items);
  }
}
