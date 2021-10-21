import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { graylogMiddleware } from './middlewares/graylog.middleware';
import { GrayLogger } from './helpers/graylog';
import { NODE_ENV, HTTP_PORT, ACTIVATE_GRAYLOG } from './config';

const grayLogger = new GrayLogger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  });

  if (NODE_ENV !== 'production') {
    //Adicionando SWAGGER
    const config = new DocumentBuilder()
      .setTitle('Plannings-api-v2')
      .setDescription('The routes API description')
      .setVersion('1.0')
      /* .addTag('cats') */
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  if (ACTIVATE_GRAYLOG === true) {
    app.use(graylogMiddleware);
    app.useLogger(grayLogger);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(HTTP_PORT);
  console.log('-------------------------------------------------------------');
  console.log(`🚀 App starting in ${NODE_ENV} mode on port ${HTTP_PORT}!! 🚀`);
  console.log('-------------------------------------------------------------');
}
bootstrap();
