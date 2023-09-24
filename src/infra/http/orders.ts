import express, { Request, Response } from 'express';
import OrdersController from '../controllers/orders_controller';
import bodyParser from 'body-parser';

const router = express.Router();

router.use((req, _, next) => {
  console.log('Orders: ', Date.now(), req.path, req.query);
  next();
});

router.post('/start-order', async (_: Request, res: Response) => {
  const results = await OrdersController.startNewOrder();

  console.log('[start-order] results', results);

  res.json({ results });
});

router.delete('/cancel-order/:orderId', bodyParser.json(), async(req: Request, res: Response) => {
  console.log('[Cancel Order]', req.body);
  console.log('[Cancel Order]', req.params);

  const orderId = req.params.orderId;
});

router.put('/add-to-order/:orderId', bodyParser.json(), async(req: Request, res: Response) => {
  console.log('[add to order]', req.body);
  console.log('[add to order]', req.params);

  const orderId = req.params.orderId;
  const productId = req.body.productId;
  const count = req.body.count;

  const results = await OrdersController.addProductToOrder(orderId, productId, count);

  res.json({ results });
});

export default router;
