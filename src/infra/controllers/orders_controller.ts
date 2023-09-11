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
};

const controller = new OrdersController(source);

export default controller;
