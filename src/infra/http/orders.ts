import express, { Request, Response } from 'express';
import OrdersController from '../controllers/orders_controller';
import Order, { Product } from '../../sources/types/order';
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

router.delete('/:orderId/cancel-order', bodyParser.json(), async(req: Request, res: Response) => {
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

router.put('/:orderId/add-to-order', bodyParser.json(), async(req: Request, res: Response) => {
  console.log('[add to order]', req.body);
  console.log('[add to order]', req.params);

  const orderId = req.params.orderId;
  const productId = req.body.productId;
  const count = req.body.count;

  const errors: Record<string, string[]> = {};

  if (!productId) {
    errors['productId'] = ['productId missing'];
  }

  if (!count) {
    errors['count'] = ['count missing'];
  }

  if (Object.keys(errors).length) {
    console.error(errors);

    return res.status(400).json({errors});
  }

  const results 
      = await OrdersController.addProductToOrder(
        orderId, 
        productId, 
        count
      );

  res.json({ results });
});

router.get('/:orderId/items', bodyParser.json(), async(req: Request, res: Response) => {
  console.log('[GET Order Items]', req.body);
  console.log('[GET Order Items] params', req.params);

  const orderId: string = req.params.orderId;

  const orderItems: Product[] = await OrdersController.getOrderItems(orderId);

  console.log('[GET Order Items] items', orderItems);

  if (!orderItems) {
    console.error('[GET Order Items] Error: not found');
    res.status(404).json({
      message: 'Order not found'
    });
  }

  res.json({
    message: 'Order found',
    orderId: orderId,
    products: orderItems
  });
});

export default router;
