import CmsSearchSource from "../../sources/cms_search_source";
import source, { OrdersSourceI } from "../../sources/orders_source";
import Order, { OrderStatus, Product } from "../../sources/types/order";

interface OrdersControllerI {
  startNewOrder: () => Promise<Order | void>;
  addProductToOrder: (
    orderId: string, 
    productId: string, 
    count: number
  ) => Promise<Order | void>;
  getOrderStatus: (orderId: string) => Promise<OrderStatus | void>;
  cancelOrder: (orderId: string) => Promise<string | void>
  getOrderItems: (orderId: string) => Promise<Product[] | void>
};

class OrdersController implements OrdersControllerI {
  source: OrdersSourceI;

  constructor(source: OrdersSourceI) {
    this.source = source;
  }

  async startNewOrder(): Promise<Order | void> {
    const order: Order = await this.source.startNewOrder() as Order;

    if (!order) {
      console.error(`[orders_controller] [startNewOrder] Error: failed
        to create a new order`);
      return;
    }

    console.log(`[orders_controller] [ startNewOrder] order created`,
      order);

    return order;
  }

  async addProductToOrder(
    orderId: string, 
    productId: string, 
    count: number
  ): Promise<Order> {
    const results = await this.source.addToOrder(
      orderId, 
      productId, 
      count
    ) as Order;

    return results;
  }

  async cancelOrder(orderId: string): Promise<string | void> {
    console.log(`[orders_controller] [cancelOrder] orderId`, orderId);

    const cancelledOrderId: string 
      = await this.source.cancelOrder(orderId) as string;

    if(!cancelledOrderId) {
      console.error(`[orders_controller] [cancelOrder] Error:
        Failed to cancel order`, orderId);
      return;
    }

    console.log(`[orders_controller] [cancelOrder] cancelledOrderId`,
      cancelledOrderId);

    return cancelledOrderId;
  }

  async getOrderItems(orderId: string): Promise<Product[] | void> {
    console.log("[getOrderItems] orderId", orderId);

    const order = await this.source.getOrder(
      orderId
    ) as Order;

    if (!order) {
      console.error("[getOrderItems] Not found", orderId);
      return;
    }

    console.log("[getOrderItems] order found", order);

    const products: Product[] = [] as Product[];

    for(const key in order.items) {
      console.log('key', key);
      const count = order.items[key]!.count_;

      const product 
        = await CmsSearchSource.fetchProduct(key) as Product;

      if(product) {
        product.count = count;

        products.push(product);
      }
    }

    console.log("[getOrderItems] products", products);

    return products;
  }

  async getOrderStatus(
    orderId: string
  ): Promise<OrderStatus | void> {
    console.log("[getOrderStatus] orderId", orderId);

    const order = await this.source.getOrder(
      orderId
    ) as Order;

    if (!order) {
      console.error("[getOrderStatus] Not found", orderId);
      return;
    }

    console.log("[getOrderStatus] status", order.status);

    return order.status;
  }
};

const controller = new OrdersController(source);

export default controller;
