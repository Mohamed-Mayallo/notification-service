import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Configuration, ConfigurationSchema } from './configuration.schema';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Configuration.name, schema: ConfigurationSchema }])],
  providers: [ConfigurationService],
  exports: [ConfigurationService]
})
export class ConfigurationModule {}
