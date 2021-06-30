import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const databaseConfig = async (configService: ConfigService) => {
  if (process.env.NODE_ENV === 'test') {
    const mongo = new MongoMemoryServer(),
      mongoUri = await mongo.getUri();
    return { uri: mongoUri };
  }

  return <MongooseModuleOptions>{
    uri: `mongodb://${configService.get('DB_HOST')}:${configService.get(
      'DB_PORT'
    )}/${configService.get('DB_NAME')}`
  };
};
