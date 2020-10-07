import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import cors = require('cors');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({});
  const options = new DocumentBuilder()
    .setTitle('vehicles')
    .setDescription('vehicles api')
    .setVersion('1.0')
    .addTag('vehi')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  app.use((req, res, next) => {
    Logger.log(req.method.toUpperCase(), req.originalUrl);
    return next();
  });
  await app.listen(port);
  Logger.log(`App runnig on port: ${port}`);
}
createConnection().then(async connection => {
  bootstrap();
});
