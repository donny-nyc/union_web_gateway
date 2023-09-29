import source, { OrdersSourceI } from "../../sources/orders_source";
import Order from "../../sources/types/order";

class OrdersController {
  source: OrdersSourceI;

  constructor(source: OrdersSourceI) {
    this.source = source;
  }

  async startNewOrder(): Promise<Order> {
    const results = this.source.startNewOrder();

    return results;
  }

  async addProductToOrder(orderId: string, productId: string, count: number): Promise<Order> {
    const results = this.source.addToOrder(orderId, productId, count);

    return results;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const results = this.source.cancelOrder(orderId);

    return results;
  }

  async getOrderItems(orderId: string): Promise<string[]> {
    const results = this.source.getOrder(orderId);
  }
};

const controller = new OrdersController(source);

export default controller;
