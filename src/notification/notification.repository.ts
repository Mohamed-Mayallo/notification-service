import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationLog, NotificationLogDocument } from './notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(NotificationLog.name) private notificationLogModel: Model<NotificationLogDocument>
  ) {}

  async createOne(notificationDetails: NotificationLog) {
    return await this.notificationLogModel.create(notificationDetails);
  }

  async createMany(notificationsDetails: NotificationLog[]) {
    return await this.notificationLogModel.create(notificationsDetails);
  }

  async findAll() {
    return await this.notificationLogModel.find();
  }
}
