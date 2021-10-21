import { Logger } from 'typeorm';
import { graylog } from 'graylog2';

import { NODE_ENV } from '../../config';

interface GraylogConfigInterface {
  productName: string;
  application: string;
  applicationName: string;
  environment: string;
  servers: { host: string; port: number }[];
}

const JsonStringify = (data: any) => JSON.stringify(data, null, 2);

export class GrayLoggerTypeOrm implements Logger {
  logger: graylog;
  staticMeta;

  constructor(config: GraylogConfigInterface) {
    this.staticMeta = {
      product_name: config.productName,
      application: config.application,
      application_name: config.applicationName,
      environment: config.environment,
    };

    this.logger = new graylog({ servers: config.servers, bufferSize: 1350 });

    this.logger.on('error', function (err) {
      if (NODE_ENV === 'development') {
        console.log(err);
      }
      console.error({ err });
    });
  }

  logQuery(query: string, parameters?: any[]) {
    const data = JsonStringify({ type: 'logQuery', query, parameters });

    this.logger.log(data, this.staticMeta);
    if (NODE_ENV === 'development') {
      console.log(data);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    const data = JsonStringify({
      type: 'logQueryError',
      error,
      query,
      parameters,
    });

    this.logger.error(data, this.staticMeta);
    if (NODE_ENV === 'development') {
      console.log(data);
    }
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const data = JsonStringify({
      type: 'logQuerySlow',
      time,
      query,
      parameters,
    });

    this.logger.log(data);
    if (NODE_ENV === 'development') {
      console.log(data);
    }
  }

  logSchemaBuild(message: string) {
    const data = JsonStringify({ type: 'logSchemaBuild', message });

    this.logger.log(data);
    if (NODE_ENV === 'development') {
      console.log(data);
    }
  }

  logMigration(message: string) {
    const data = JsonStringify({ type: 'logMigration', message });

    this.logger.log(data);
    if (NODE_ENV === 'development') {
      console.log(data);
    }
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    const data = JsonStringify({ type: 'log', level, message });

    this.logger.log(data);
    if (NODE_ENV === 'development') {
      console.log(data);
    }
  }
}
