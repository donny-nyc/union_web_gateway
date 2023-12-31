import express, { Response } from 'express';
import SearchRequest, { Validator as SearchRequestValidator } from './types/search_request';
import SearchController from '../controllers/search_controller';

const router = express.Router()

router.use((req, _, next) => {
  console.log('Search: ', Date.now(), req.path, req.query);
  next();
});

router.get('/', async (req: SearchRequest, res: Response) => {
  let errors: {[key: string]: string[]} | undefined = SearchRequestValidator(req);
  if(errors) {
    res.status(400).json({ errors });
  }

  const { name } = req.query;

  const results = await SearchController.fetch(name);

  res.json({ results });
});

export default router;
