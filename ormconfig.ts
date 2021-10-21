module.exports = {
  type: process.env.DB_USE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
};
