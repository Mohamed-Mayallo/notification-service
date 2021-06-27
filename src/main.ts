import * as compression from 'compression';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './_common/utils/env';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  app.use(helmet());
  app.use(compression());

  await app.listen(env.PORT);
}

bootstrap();
