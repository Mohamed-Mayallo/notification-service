import IORedis from 'ioredis';
import { BullModule } from '@nestjs/bull';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { Response } from 'express';
import { env } from '../utils/env';
import { QueueUIProvider } from './bull-board.provider';

const connectionOptions = {
    host: env.REDIS_HOST,
    port: +env.REDIS_PORT,
    password: env.REDIS_PASS
  },
  client = new IORedis(connectionOptions),
  subscriber = new IORedis(connectionOptions);

const queues = [
  BullModule.registerQueue({ name: 'PushNotifications' }),
  BullModule.registerQueue({ name: 'SmsNotifications' })
];

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async () => ({
        createClient(type) {
          switch (type) {
            case 'client':
              return client;
            case 'subscriber':
              return subscriber;
            default:
              return new IORedis(connectionOptions);
          }
        },
        defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 10 }
      })
    }),
    ...queues
  ],
  providers: [QueueUIProvider],
  exports: [...queues]
})
export class NestBullModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply((_, res: Response, next: any) => {
        if (env.NODE_ENV === 'production') return res.sendStatus(401);
        next();
      }, QueueUIProvider.router)
      .forRoutes('/admin/queues');
  }
}
