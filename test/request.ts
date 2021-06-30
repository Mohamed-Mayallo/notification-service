import * as request from 'supertest';
import { app } from './setup';

export async function post(path: string, data?: object): Promise<request.Response> {
  const req = request(app.getHttpServer()).post(path).send(data);
  return await req;
}
