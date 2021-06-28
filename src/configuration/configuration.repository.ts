import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Configuration, ConfigurationDocument } from './configuration.schema';

@Injectable()
export class ConfigurationRepository {
  constructor(
    @InjectModel(Configuration.name) private configurationModel: Model<ConfigurationDocument>
  ) {}

  async findOne(filter: FilterQuery<ConfigurationDocument>) {
    return await this.configurationModel.findOne(filter);
  }

  async updateOneFromExistingModel(model: ConfigurationDocument, input: Partial<Configuration>) {
    for (const field in input) model[field] = input[field];
    await model.save();
    return model.toJSON();
  }
}
