import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FavoriteLangEnum } from 'src/user/user.type';
import { NotificationStatusEnum, NotificationTypeEnum } from './notification.enum';

export type NotificationLogDocument = NotificationLog & Document;

@Schema()
export class NotificationContent {
  @Prop({ required: true })
  enSubject: string;

  @Prop({ required: true })
  arSubject: string;

  @Prop({ required: true })
  enBody: string;

  @Prop({ required: true })
  arBody: string;
}

@Schema()
export class NotificationLog {
  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, enum: Object.keys(NotificationStatusEnum) })
  status: NotificationStatusEnum;

  @Prop({ required: true, enum: Object.keys(NotificationTypeEnum) })
  type: NotificationTypeEnum;

  @Prop({ type: NotificationContent, required: true })
  notificationContent: NotificationContent;

  @Prop({ enum: Object.keys(FavoriteLangEnum), required: true })
  notificationLang: FavoriteLangEnum;

  @Prop({ required: true, default: 0 })
  retries: number;

  @Prop({ required: true, default: new Date(), type: Date })
  createdAt: Date;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
