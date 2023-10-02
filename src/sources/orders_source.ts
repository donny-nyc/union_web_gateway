import HttpClient from '../infra/utils/http_client';
import Order, { Product } from './types/order';

type GetOrderResponse = {
  message: string,
  order: Order
};

type AddToOrderResponse = {
  message: string,
  order: Order,
};

type GetProductResponse = {
  id: string,
  name: string,
  price: number,
  keywords: string[],
  unit?: string,
  description?: string,
};

export interface OrdersSourceI {
  startNewOrder: () => Promise<Order>;
  addToOrder: (orderId: string, productId: string, count: number) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order>;
};


class OrdersSource {
  private ordersHost = "localhost";
  private ordersPort = 4321;

  private productsHost = "localhost";
  private productsPort = 9999;
  
  cancelOrder = (orderId: string): Order => {
    console.log('[cancelOrder] orderId', orderId);
    
    return {} as Order;
  };

  async getOrder(orderId: string): Promise<Order> {
    console.log(`[Orders] Fetching order ${orderId}`);

    const url = `/orders/${orderId}`;

    const res
      = await HttpClient.get(this.ordersHost, this.ordersPort, url);

    const orderResponse 
      = JSON.parse(res as string) as GetOrderResponse;

    const order = orderResponse.order;

    order.products = new Map<string, Product>();

    for(const itemKey in order.items) {
      const productsUrl = `/crud/${itemKey}`;

      const response
        = await HttpClient.get(
          this.productsHost, 
          this.productsPort,
          productsUrl);

      const product
        = JSON.parse(response as string) as GetProductResponse;

      order.products.set(itemKey, product);
    }

    return order;
  }

  async addToOrder(
    orderId: string, 
    productId: string, 
    count: number
  ): Promise<Order> {
    console.log(`[Orders] Adding product to order: product: ${productId}, count: ${count}, orderId: ${orderId}`);

    const postData = {
      orderId,
      productId,
      count
    };

    const path = `/orders/add-to-order/${orderId}`;

    const res = await HttpClient.post(
      this.ordersHost, 
      this.ordersPort, 
      path, 
      postData
    );

    const addToOrderResult 
      = JSON.parse(res as string) as AddToOrderResponse;

    return addToOrderResult.order;
  };

  /*
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
  */
}

const source = new OrdersSource();

export default source;
