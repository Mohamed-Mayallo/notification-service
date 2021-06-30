import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { lorem } from 'faker';
import { NotificationProvidersEnum } from 'src/configuration/configuration.enum';
import { NotificationStatusEnum, NotificationTypeEnum } from 'src/notification/notification.enum';
import { NotificationRepository } from 'src/notification/notification.repository';
import { app } from './setup';
import { post } from './request';
import { setQueueConfiguration } from './set-queue-configuration';
import { notificationInputGenerator } from './push-input-generator';

describe('Push notifications suite case', () => {
  it('push_for_single_token_and_save_log_into_db', async () => {
    const res = await post(
      '/notifications/push',
      notificationInputGenerator(NotificationTypeEnum.PUSH)
    );
    const notificationRepo = app.get(NotificationRepository);
    const notificationsLog = await notificationRepo.findAll();

    expect(res.body.statusCode).toBe(200);
    expect(notificationsLog.length).toBe(1);
  });

  it('check_db_log_fields', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.PUSH);
    const res = await post('/notifications/push', input);
    const notificationRepo = app.get(NotificationRepository);
    const notificationsLog = await notificationRepo.findAll();

    expect(res.body.statusCode).toBe(200);
    expect(notificationsLog.length).toBe(1);
    expect(notificationsLog[0].destination).toBe(input.destinations[0]);
    expect(notificationsLog[0].providerName).toBe(NotificationProvidersEnum.FIREBASE_PUSHER);
    expect(notificationsLog[0].status).toBe(NotificationStatusEnum.DELIVERED);
    expect(notificationsLog[0].type).toBe(NotificationTypeEnum.PUSH);
    expect(notificationsLog[0].notificationLang).toBe(input.favoriteLang);
    expect(notificationsLog[0].retries).toBe(1);
  });

  it('subject_in_input_has_not_exceed_limit_length', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.PUSH, {
      arSubject: lorem.paragraph()
    });
    const res = await post('/notifications/push', input);

    expect(res.body.statusCode).toBe(400);
    expect(res.body.message).toContain('arSubject');
  });

  it('body_in_input_has_not_exceed_limit_length', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.PUSH, {
      enBody: lorem.paragraphs()
    });
    const res = await post('/notifications/push', input);

    expect(res.body.statusCode).toBe(400);
    expect(res.body.message).toContain('enBody');
  });

  it('send_to_multi_tokens', async () => {
    await setQueueConfiguration('2', '2');

    const input = notificationInputGenerator(NotificationTypeEnum.PUSH, {}, true);
    const res = await post('/notifications/push', input);
    const notificationRepo = app.get(NotificationRepository);
    const notificationsLog = await notificationRepo.findAll();

    expect(res.body.statusCode).toBe(200);
    expect(notificationsLog.length).toBe(2);
  });

  it('send_to_multi_tokens_and_add_notifications_to_queue', async () => {
    await setQueueConfiguration();

    const input = notificationInputGenerator(NotificationTypeEnum.PUSH, {}, true);
    const res = await post('/notifications/push', input);
    expect(res.body.statusCode).toBe(200);

    const queue: Queue = app.get(getQueueToken('PushNotifications'));
    const jobsCounts = await queue.getJobCounts();
    expect(jobsCounts.delayed + jobsCounts.active).toBe(2);
  });
});
