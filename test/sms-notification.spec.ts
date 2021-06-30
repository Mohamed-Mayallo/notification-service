import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { lorem } from 'faker';
import { NotificationProvidersEnum } from 'src/configuration/configuration.enum';
import { NotificationStatusEnum, NotificationTypeEnum } from 'src/notification/notification.enum';
import { NotificationRepository } from 'src/notification/notification.repository';
import { NOT_VALID_PHONE_NUMBER } from './constants';
import { app } from './setup';
import { post } from './request';
import { setQueueConfiguration } from './set-queue-configuration';
import { notificationInputGenerator } from './push-input-generator';

describe('Send sms notifications suite case', () => {
  it('send_for_single_phone_number_and_save_log_into_db', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.SMS);
    const res = await post('/notifications/sms', input);
    const notificationRepo = app.get(NotificationRepository);
    const notificationsLog = await notificationRepo.findAll();

    expect(res.body.statusCode).toBe(200);
    expect(notificationsLog.length).toBe(1);
  });

  it('check_db_log_fields', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.SMS);
    const res = await post('/notifications/sms', input);
    const notificationRepo = app.get(NotificationRepository);
    const notificationsLog = await notificationRepo.findAll();

    expect(res.body.statusCode).toBe(200);
    expect(notificationsLog.length).toBe(1);
    expect(notificationsLog[0].destination).toBe(input.destinations[0]);
    expect(notificationsLog[0].providerName).toBe(NotificationProvidersEnum.AWS_SNS_SMS);
    expect(notificationsLog[0].status).toBe(NotificationStatusEnum.DELIVERED);
    expect(notificationsLog[0].type).toBe(NotificationTypeEnum.SMS);
    expect(notificationsLog[0].notificationLang).toBe(input.favoriteLang);
    expect(notificationsLog[0].retries).toBe(1);
  });

  it('phone_number_has_to_be_valid', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.SMS, {
      destinations: [NOT_VALID_PHONE_NUMBER]
    });
    const res = await post('/notifications/sms', input);

    expect(res.body.statusCode).toBe(400);
    expect(res.body.message).toContain('phone');
  });

  it('subject_in_input_has_not_exceed_limit_length', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.SMS, {
      enSubject: lorem.paragraph()
    });
    const res = await post('/notifications/sms', input);

    expect(res.body.statusCode).toBe(400);
    expect(res.body.message).toContain('enSubject');
  });

  it('body_in_input_has_not_exceed_limit_length', async () => {
    const input = notificationInputGenerator(NotificationTypeEnum.SMS, {
      arBody: lorem.paragraphs()
    });
    const res = await post('/notifications/sms', input);

    expect(res.body.statusCode).toBe(400);
    expect(res.body.message).toContain('arBody');
  });

  it('send_to_multi_phone_numbers', async () => {
    await setQueueConfiguration('2', '2');

    const input = notificationInputGenerator(NotificationTypeEnum.SMS, {}, true);
    const res = await post('/notifications/sms', input);
    const notificationRepo = app.get(NotificationRepository);
    const notificationsLog = await notificationRepo.findAll();

    expect(res.body.statusCode).toBe(200);
    expect(notificationsLog.length).toBe(2);
  });

  it('send_to_multi_phone_numbers_and_add_notifications_to_queue', async () => {
    await setQueueConfiguration();

    const input = notificationInputGenerator(NotificationTypeEnum.SMS, {}, true);
    const res = await post('/notifications/sms', input);
    expect(res.body.statusCode).toBe(200);

    const queue: Queue = app.get(getQueueToken('SmsNotifications'));
    const jobsCounts = await queue.getJobCounts();
    expect(jobsCounts.delayed + jobsCounts.active).toBeLessThanOrEqual(2);
  });
});
