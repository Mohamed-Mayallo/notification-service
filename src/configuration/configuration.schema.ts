import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ConfigurationKeyEnum, NotificationProvidersEnum } from './configuration.enum';

export type ConfigurationDocument = Configuration & Document;

@Schema()
export class Configuration {
  @Prop({ required: true, enum: Object.keys(ConfigurationKeyEnum) })
  key: ConfigurationKeyEnum;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  displayedOnBoardAs: string;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
