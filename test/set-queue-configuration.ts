import { ConfigurationKeyEnum } from 'src/configuration/configuration.enum';
import { ConfigurationRepository } from 'src/configuration/configuration.repository';
import { app } from './setup';

export async function setQueueConfiguration(
  queueDelayInSec: string = '0.4',
  limitOfSentNotificationsInMinute: string = '1'
) {
  const configurationRepo = app.get(ConfigurationRepository);
  await configurationRepo.createOne({
    key: ConfigurationKeyEnum.QUEUE_DELAY_IN_SEC,
    value: queueDelayInSec,
    displayedOnBoardAs: 'any'
  });
  await configurationRepo.createOne({
    key: ConfigurationKeyEnum.LIMIT_OF_SENT_NOTIFICATIONS_IN_MINUTE,
    value: limitOfSentNotificationsInMinute,
    displayedOnBoardAs: 'any'
  });
}
