import { Configuration, ConfigurationDocument } from './configuration.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateConfigurationInput } from './configuration.input';
import { ConfigurationKeyEnum, ConfigurationValueEnum } from './configuration.enum';
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
    return await this.configurationRepository.updateOneFromExistingModel(configuration, input);
  }

  async getDefaultSmsProvider(): Promise<ConfigurationValueEnum> {
    const configuration = await this.configurationByKey(ConfigurationKeyEnum.DEFAULT_SMS_SERVICE);
    return configuration ? configuration.value : ConfigurationValueEnum.AWS_SNS;
  }

  async getDefaultPusherProvider(): Promise<ConfigurationValueEnum> {
    const configuration = await this.configurationByKey(
      ConfigurationKeyEnum.DEFAULT_PUSHER_SERVICE
    );
    return configuration ? configuration.value : ConfigurationValueEnum.FIREBASE_PUSHER;
  }
}
