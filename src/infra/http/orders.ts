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

  const results = await OrdersController.cancelOrder(orderId);

  // we need type safety on these responses
  // impossible to tell what's being returned 
  // without some serious digging
  // should be possible within a couple hops, at most
  res.json({ results });
});

router.put('/add-to-order/:orderId', bodyParser.json(), async(req: Request, res: Response) => {
  console.log('[add to order]', req.body);
  console.log('[add to order]', req.params);

  const orderId = req.params.orderId;
  const productId = req.body.productId;
  const count = req.body.count;

  const results 
      = await OrdersController.addProductToOrder(
        orderId, 
        productId, 
        count
      );

  res.json({ results });
});

router.get('/order-items/:orderId', bodyParser.json(), async(req: Request, res: Response) => {
  console.log('[GET Order Items]', req.body);
  console.log('[GET Order Items]', req.params);

  const orderId = req.params.orderId;

  //const itemIds = await OrdersController.getOrderItems(orderId);

  //const orderItems = await CMSController.bulkFetchItems(itemIds);

  // res.json({ orderItems }) or something to that effect
});

export default router;
