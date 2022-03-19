import { env } from './helpers';

export const CONFIG = {
  API_VERSION: '0.0.1',
  API_HEALTH_MESSAGE: 'Api is Ok!',
};

//Variaveis do .env
export const JWT_PRIVATE_KEY: string = env('JWT_PRIVATE_KEY', 'mysupersecret');
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
export const USE_BEARER_TOKEN: boolean = eval(env('USE_BEARER_TOKEN', true));
export const AWS_BUCKET: string = env('AWS_BUCKET');
export const AWS_BUCKET_MAXFILESIZE: string = env('AWS_BUCKET_MAXFILESIZE');
export const AWS_ACCESS_KEY_ID: string = env('AWS_ACCESS_KEY_ID');
export const AWS_SECRET_ACCESS_KEY: string = env('AWS_SECRET_ACCESS_KEY');
export const AWS_REGION: string = env('AWS_REGION');
export const AWS_URL_EXPIRES: number = env('AWS_URL_EXPIRES', 86400);
export const AWS_URL_ROUTE_S3_DNS: string = env('AWS_URL_ROUTE_S3_DNS');
export const X_API_KEY: string = env(
  'X_API_KEY',
  'bb394d3b6661b46652422cb104665df415753571',
);
