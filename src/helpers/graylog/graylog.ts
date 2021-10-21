import { LoggerService } from '@nestjs/common';
import { graylog } from 'graylog2';

import { NODE_ENV } from '../../config';
import { env } from '../env';

const staticMeta = {
  product_name: env('GRAYLOG_NAME'),
  application: env('GRAYLOG_APPLICATION'),
  application_name: env('GRAYLOG_APPLICATION_NAME'),
  environment: env('GRAYLOG_ENVIRONMENT'),
};

const params = {
  servers: [
    {
      host: env('GRAYLOG_HOST'),
      port: parseInt(env('GRAYLOG_PORT')),
    },
  ],
  bufferSize: 1350,
};

const logger = new graylog(params);
logger.on('error', function (err) {
  console.error({ err });
});

export class GrayLogger implements LoggerService {
  log(message: string) {
    logger.log(message, staticMeta);
    if (NODE_ENV === 'development') {
      console.log(message);
    }
  }

  error(message: string, trace: string) {
    logger.error({ message, trace }, staticMeta);
    if (NODE_ENV === 'development') {
      console.error(message);
    }
  }

  warn(message: string) {
    logger.warn(message, staticMeta);
    if (NODE_ENV === 'development') {
      console.warn(message);
    }
  }

  debug(message: string) {
    logger.debug(message, staticMeta);
    if (NODE_ENV === 'development') {
      console.debug(message);
    }
  }

  verbose(message: string) {
    logger.verbose(message, staticMeta);
    if (NODE_ENV === 'development') {
      console.log(message);
    }
  }
}
