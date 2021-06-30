import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

export let app: INestApplication;
export let connection: Connection;

beforeAll(async () => {
  jest.setTimeout(50000);
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = moduleRef.createNestApplication();
  connection = await app.get(getConnectionToken());
  await app.init();
});

afterEach(async () => {
  await connection.dropDatabase();
});

beforeEach(async () => {
  const smsQueue: Queue = app.get(getQueueToken('SmsNotifications'));
  const pushQueue: Queue = app.get(getQueueToken('PushNotifications'));
  const delayedSmsJobs = await smsQueue.getDelayed();
  const delayedPushJobs = await pushQueue.getDelayed();
  for (const job of [...delayedPushJobs, ...delayedSmsJobs]) {
    await job.discard();
    await job.moveToFailed(new Error('removed by user'), true);
    await job.remove();
  }
});

afterAll(async () => {
  await connection.close(true);
  await app.close();
});
