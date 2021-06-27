import { NotificationInput } from './notification.input';
import { IProviderStrategy, SendResponse } from './provider-strategy.interface';

export abstract class NotificationStrategy {
  protected provider: IProviderStrategy;

  abstract defineDefaultProvider(): Promise<IProviderStrategy>;
  abstract saveLog(input: NotificationInput, response: SendResponse): Promise<void>;

  async send(input: NotificationInput): Promise<void> {
    const defaultProvider = await this.defineDefaultProvider();
    this.provider = defaultProvider;
    await this.defineAppropriateSender(input);
  }

  private async defineAppropriateSender(input: NotificationInput) {
    if (this.isMulti(input.destinations)) await this.sendToMultiAndSaveLog(input);
    else await this.sendToSingleAndSaveLog(input);
  }

  private isMulti(destinations: string[]): boolean {
    return !!destinations[1];
  }

  private async sendToSingleAndSaveLog(input: NotificationInput) {
    const res = await this.provider.sendToSingle(input);
    await this.saveLog(input, res);
  }

  private async sendToMultiAndSaveLog(input: NotificationInput) {
    const res = await this.provider.sendToMulti(input); // TODO
    for (const singleRes of res) await this.saveLog(input, singleRes); // TODO
  }
}
