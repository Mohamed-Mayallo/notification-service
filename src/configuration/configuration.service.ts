import { Configuration, ConfigurationDocument } from './configuration.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateConfigurationInput } from './configuration.input';
import { ConfigurationKeyEnum, NotificationProvidersEnum } from './configuration.enum';
import { ConfigurationRepository } from './configuration.repository';

@Injectable()
export class ConfigurationService {
  constructor(private configurationRepository: ConfigurationRepository) {}

  async updateConfiguration(input: UpdateConfigurationInput): Promise<Configuration> {
    const configuration = await this.configurationByKeyOrError(input.key);
    return await this.updateConfigurationFieldsAndReturnRaw(configuration, input);
  }

  private async configurationByKeyOrError(
    key: ConfigurationKeyEnum
  ): Promise<ConfigurationDocument> {
    const configuration = await this.configurationByKey(key);
    if (!configuration) throw new NotFoundException();
    return configuration;
  }

  private async configurationByKey(key: ConfigurationKeyEnum): Promise<ConfigurationDocument> {
    return await this.configurationRepository.findOne({ key });
  }

  private async updateConfigurationFieldsAndReturnRaw(
    configuration: ConfigurationDocument,
    input: UpdateConfigurationInput
  ): Promise<Configuration> {
    return await this.configurationRepository.updateOneFromExistingModel(
      configuration,
      input as unknown as Partial<Configuration>
    );
  }

  async getDefaultSmsProvider() {
    const configuration = await this.configurationByKey(ConfigurationKeyEnum.DEFAULT_SMS_SERVICE);
    return configuration ? configuration.value : NotificationProvidersEnum.AWS_SNS_SMS;
  }

  async getDefaultPusherProvider() {
    const configuration = await this.configurationByKey(
      ConfigurationKeyEnum.DEFAULT_PUSHER_SERVICE
    );
    return configuration ? configuration.value : NotificationProvidersEnum.FIREBASE_PUSHER;
  }

  async getQueueDelayInSec(): Promise<number> {
    const configuration = await this.configurationByKey(ConfigurationKeyEnum.QUEUE_DELAY_IN_SEC);
    return configuration && !isNaN(Number(configuration.value)) ? Number(configuration.value) : 3;
  }

  async getLimitOfSentNotificationsInMinute(): Promise<number> {
    const configuration = await this.configurationByKey(
      ConfigurationKeyEnum.LIMIT_OF_SENT_NOTIFICATIONS_IN_MINUTE
    );
    return configuration && !isNaN(Number(configuration.value)) ? Number(configuration.value) : 3;
  }
}
