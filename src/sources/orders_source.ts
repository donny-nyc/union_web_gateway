import Order from './types/order';
import http from 'http';

type OrderResponse = {
  products: any,
  id: string,
  index: string
};

type NewOrderResult = {
  message: string,
  data: {
    order: OrderResponse
  }
};

type CancelledOrderResult = {
  message: string,
  data: {
    id: string
  }
};

export interface OrdersSourceI {
  startNewOrder: () => Promise<Order>;
  addToOrder: (orderId: string, productId: string, count: number) => Promise<Order>;
};

class OrdersSource {
  addToOrder = async (orderId: string, productId: string, count: number): Promise<Order> => {
    const requestPromise = new Promise<Order>((resolve) => {
      console.log(`[Orders] Adding product to order: pid: ${productId}, count: ${count}, orderId: ${orderId}`);

      const post_data = JSON.stringify({
        orderId,
        productId,
        count
      });

      const post_options = {
        host: 'localhost',
        port: 4321,
        path: `/orders/add-to-order/${orderId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
        }
      };

      const req = http.request(post_options, (res) => {
        let data: any = []

        if(res.statusCode !== 200) {
          throw new Error("failed to put");
        }

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log('Order created');

          console.log(Buffer.concat(data).toString());

          const orderResult: NewOrderResult = JSON.parse(Buffer.concat(data).toString())

          console.log('[Orders] new order: ', orderResult);

          const order: Order = {
            id: orderResult.data.order.id
          }

          resolve(order);
        });
      });

      try {
        req.write(post_data);
        req.end();
      } catch (e: any) {
        console.error(e);
      }
    });

    const result: Order = await requestPromise;

    console.log(result);

    return result;
  };

  startNewOrder = async (): Promise<Order> => {
    const requestPromise = new Promise<Order>((resolve) => {
      console.log('[Orders] Creating New Order');

      const post_options = {
        host: 'localhost',
        port: 4321,
        path: '/orders',
        method: 'POST',
      };

      const req = http.request(post_options, (res) => {
        let data: any = []

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log('Order created');

          console.log(Buffer.concat(data).toString());

          const orderResult: NewOrderResult = JSON.parse(Buffer.concat(data).toString())

          console.log('[Orders] new order: ', orderResult);

          const order: Order = {
            id: orderResult.data.order.id
          }

          resolve(order);
        });
      });

      req.end();
    });

    const result: Order = await requestPromise;

    console.log(result);

    return result;
  }

  cancelOrder = async (orderId: string): Promise<Order> => {
    const requestPromise = new Promise<Order>((resolve) => {
      console.log('[Orders] Cancelling an order');

      const post_options = {
        http: 'localhost',
        port: 4321,
        path: '/orders',
        method: 'DELETE',
      };

      const req = http.request(post_options, (res) => {
        let data: any = [];

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log('Order Cancelled');

          console.log(Buffer.concat(data).toString());

          const orderResult: CancelledOrderResult = JSON.parse(Buffer.concat(data).toString());

          console.log('[Orders] Cancelled Order:', orderResult);

          const order: Order = {
            id: orderResult.data.order.id
          }

          resolve(order);
        });
      });

      req.end();
    });

    const result: Order = await requestPromise;

    console.log(result);

    return result;
  }
}

const source = new OrdersSource();

export default source;
