import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import search from './infra/http/search';
import orders from './infra/http/orders';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.get('/', (_: Request, res: Response) => {
  res.json({message: 'express'});
});

app.use('/search', search);

app.use('/orders', orders);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
