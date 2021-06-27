import { NotificationInput } from './notification.input';
import { IProviderStrategy } from './provider-strategy.interface';

export abstract class NotificationStrategy {
  protected provider: IProviderStrategy;

  abstract defineDefaultProvider(): Promise<IProviderStrategy>;

  async send(input: NotificationInput): Promise<void> {
    const defaultProvider = await this.defineDefaultProvider();
    this.provider = defaultProvider;
    if (this.isMulti(input.destinations)) await this.sendToMulti(input.destinations);
    else await this.sendToSingle(input.destinations[0]);
  }

  private isMulti(destinations: string[]): boolean {
    return !!destinations[1];
  }

  private async sendToSingle(destination: string) {
    await this.provider.sendToSingle(destination);
  }

  private async sendToMulti(destinations: string[]) {
    await this.provider.sendToMulti(destinations);
  }
}
