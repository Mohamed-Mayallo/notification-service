import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationRepository } from 'src/configuration/configuration.repository';
import { Configuration, ConfigurationSchema } from 'src/configuration/configuration.schema';
import { NotificationRepository } from 'src/notification/notification.repository';
import { NotificationLog, NotificationLogSchema } from 'src/notification/notification.schema';

export const databaseRepositories = [NotificationRepository, ConfigurationRepository];

export const databaseModels = MongooseModule.forFeature([
  { name: Configuration.name, schema: ConfigurationSchema },
  { name: NotificationLog.name, schema: NotificationLogSchema }
]);
