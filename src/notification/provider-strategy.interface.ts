export interface IProviderStrategy {
  sendToSingle(item: string): Promise<void>;
  sendToMulti(items: string[]): Promise<void>;
}
