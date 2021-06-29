import { NotificationInput } from './notification.input';
import { IProviderStrategy, SendResponse } from './provider-strategy.interface';

export abstract class NotificationStrategy {
  protected provider: IProviderStrategy;
  protected limitOfSentNotificationsInMinute: number = 10;
  protected queueDelayInMS: number = 1 * 60 * 1000;

  abstract defineDefaultProvider(): Promise<IProviderStrategy>;
  abstract saveLog(input: NotificationInput, response: SendResponse): Promise<void>;
  abstract productNotificationsQueue(
    input: NotificationInput,
    overrideQueueDelayInMS?: number
  ): Promise<void>;

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

  public async sendToMultiAndSaveLog(input: NotificationInput) {
    const res = await this.provider.sendToMulti(input);
    for (const singleRes of res) await this.saveLog(input, singleRes);
  }

  private async addNotificationsToQueue(input: NotificationInput) {
    const delayForFirstQueueInMS = 0;
    for (
      let start = 0;
      start < input.destinations.length;
      start + this.limitOfSentNotificationsInMinute
    ) {
      await this.productNotificationsQueue(
        {
          ...input,
          destinations: input.destinations.slice(
            start,
            start + this.limitOfSentNotificationsInMinute
          )
        },
        start === 0 ? delayForFirstQueueInMS : this.queueDelayInMS
      );
    }
  }
}
