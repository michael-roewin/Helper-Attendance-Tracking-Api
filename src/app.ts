import express from 'express';
import 'dotenv/config'
import routes from './routes';
import config from './mikro-orm.config';
import { MikroORM, RequestContext } from '@mikro-orm/postgresql';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
  const orm = app.get('orm');

  if (orm) {
    RequestContext.create(orm.em, next);
  }
});

const port = 3000;

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
