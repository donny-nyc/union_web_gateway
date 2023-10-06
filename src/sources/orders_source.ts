import HttpClient from '../infra/utils/http_client';
import Order from './types/order';

type GetOrderResponse = {
  message: string,
  order: Order
};

type AddToOrderResponse = {
  message: string,
  order: Order,
};

type CancelOrderResponse = {
  message: string,
  id: string,
};

type StartNewOrderResponse = {
  message: string,
  order: Order
};

export interface OrdersSourceI {
  startNewOrder: () => Promise<Order | void>;
  addToOrder: (orderId: string, productId: string, count: number) => Promise<Order | void>;
  cancelOrder: (orderId: string) => Promise<string | void>;
  getOrder: (orderId: string) => Promise<Order | void>;
};


class OrdersSource {
  private static ordersHost = "localhost";
  private static ordersPort = 4321;

  static async cancelOrder(orderId: string): Promise<string | void> {
    console.log(`[cancelOrder] orderId ${orderId}`);

    const url = `/orders/${orderId}`;

    const cancelResult
      = await HttpClient.delete(
        this.ordersHost,
        this.ordersPort,
        url
      ) as CancelOrderResponse;

    console.log(`[orders source] [cancel order] order cancelled`,
      orderId, cancelResult);

    const cancelledId: string = cancelResult.id;
    
    return cancelledId;
  };

  static async getOrder(orderId: string): Promise<Order> {
    console.log(`[Orders] Fetching order ${orderId}`);

    const url = `/orders/${orderId}`;

    const res = await HttpClient.get(
      this.ordersHost, 
      this.ordersPort, 
      url
    ) as GetOrderResponse;

    const order: Order = res.order;

    return order;
  }

  static async addToOrder(
    orderId: string, 
    productId: string, 
    count: number
  ): Promise<Order | void> {
    console.log(`[Orders] Adding product to order: product: ${productId}, count: ${count}, orderId: ${orderId}`);

    const data = {
      productId,
      count
    };

    const path = `/orders/${orderId}/add-to-order`;

    const res = await HttpClient.put(
      this.ordersHost, 
      this.ordersPort, 
      path, 
      data
    ) as AddToOrderResponse;

    if (!res.order) {
      console.error(`[orders_source] [fetch product] ERROR:
        unable to fetch product`);
      return;
    }

    console.log(res.order.items);

    return res.order;
  };

  static async startNewOrder(): Promise<Order | void> {
    console.log("[startNewOrder]");

    const path = '/orders/';

    const res = await HttpClient.post(
      this.ordersHost,
      this.ordersPort,
      path
    ) as StartNewOrderResponse;

    console.log("[startNewOrder] results", res);

    return res.order;
  }
}

export default OrdersSource;
