import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = (configService: ConfigService) => {
  return <MongooseModuleOptions>{
    uri: `mongodb://${configService.get('DB_HOST')}:${configService.get(
      'DB_PORT'
    )}/${configService.get('DB_NAME')}`
  };
};
