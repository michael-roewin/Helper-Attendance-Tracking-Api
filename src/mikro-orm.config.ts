import 'dotenv/config'
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options = {
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  // folder-based discovery setup, using common filename suffix
  entities: ['./dist/**/*'],
  entitiesTs: ['./src/entities/**/*'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  // enable debug mode to log SQL queries and discovery information
  debug: true,
};

export default config;