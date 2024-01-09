import express from 'express';
// import { Pool } from 'pg';
import 'dotenv/config'
import routes from './routes';
import config from './mikro-orm.config';
import { MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { Pool } from 'pg';
import { User } from './entities/user';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const orm = app.get('orm');

  if (orm) {
    RequestContext.create(orm.em, next);
  }
});

const port = 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

app.set('pgPool', pool);

MikroORM.init(config).then(async (orm) => {
  app.set('orm', orm);
});

app.get('/', (req, res) => {
  res.send('Hello world');
})

app.use(routes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})
