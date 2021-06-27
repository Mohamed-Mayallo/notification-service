export interface IProviderStrategy {
  sendToSingle(destination: string): Promise<void>;
  sendToMulti(destinations: string[]): Promise<void>;
}
