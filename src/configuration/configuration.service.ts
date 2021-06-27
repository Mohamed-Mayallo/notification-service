import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { Configuration, ConfigurationDocument } from './configuration.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateConfigurationInput } from './configuration.input';
import { ConfigurationKeyEnum, ConfigurationValueEnum } from './configuration.enum';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name) private configurationModel: Model<ConfigurationDocument>
  ) {}

  async updateConfiguration(input: UpdateConfigurationInput): Promise<Configuration> {
    const configuration = await this.configurationByKeyOrError(input.key);
    return await this.updateConfigurationFieldsAndReturnRaw(configuration, input);
  }

  private async configurationByKeyOrError(
    key: ConfigurationKeyEnum
  ): Promise<ConfigurationDocument> {
    const configuration = await this.configurationModel.findOne({ key });
    if (!configuration) throw new BaseHttpException('EN', 613);
    return configuration;
  }

  private async updateConfigurationFieldsAndReturnRaw(
    configuration: ConfigurationDocument,
    input: UpdateConfigurationInput
  ): Promise<Configuration> {
    if (input.value) configuration.value = input.value;
    if (input.displayedOnBoardAs) configuration.displayedOnBoardAs = input.displayedOnBoardAs;
    await configuration.save();
    return configuration.toJSON();
  }

  async getDefaultSmsProvider(): Promise<ConfigurationValueEnum> {
    const configuration = await this.configurationByKeyOrError(
      ConfigurationKeyEnum.DEFAULT_SMS_SERVICE
    );
    return configuration.value;
  }

  async getDefaultPusherProvider(): Promise<ConfigurationValueEnum> {
    const configuration = await this.configurationByKeyOrError(
      ConfigurationKeyEnum.DEFAULT_PUSHER_SERVICE
    );
    return configuration.value;
  }
}
