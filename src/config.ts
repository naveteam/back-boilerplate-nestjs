import { env } from './helpers';

export const CONFIG = {
  API_VERSION: '0.0.1',
  API_HEALTH_MESSAGE: 'Api is Ok!',
};

//Variaveis do .env
export const ACCESS_SECRET: string = env('ACCESS_SECRET', 'mysupersecret');
export const HTTP_PORT: number = env('HTTP_PORT', 3000);
export const NODE_ENV: string = env('NODE_ENV', 'development');
export const DB_USE: any = env('DB_USE');
export const DATABASE_HOST: string = env('DATABASE_HOST', 'localhost');
export const DATABASE_PORT: number = env('DATABASE_PORT', 3306);
export const DATABASE_USER: string = env('DATABASE_USER');
export const DATABASE_PASSWORD: string = env('DATABASE_PASSWORD');
export const DATABASE: string = env('DATABASE');
export const LOGGING_TYPEORM: boolean = eval(env('LOGGING_TYPEORM', false));
export const MIGRATIONS_RUN_AUTOMATIC: boolean = eval(
  env('MIGRATIONS_RUN_AUTOMATIC', false),
);
export const SYNCHRONIZE_TYPEORM_DB: boolean = eval(
  env('SYNCHRONIZE_TYPEORM_DB', false),
);
export const ACTIVATE_GRAYLOG: boolean = eval(env('ACTIVATE_GRAYLOG', false));
