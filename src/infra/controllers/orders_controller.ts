import CmsSearchSource from "../../sources/cms_search_source";
import source, { OrdersSourceI } from "../../sources/orders_source";
import Order, { Product } from "../../sources/types/order";

class OrdersController {
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

    return order;;
  }

  async addProductToOrder(
    orderId: string, 
    productId: string, 
    count: number
  ): Promise<Order> {
    const results 
      = await this.source.addToOrder(orderId, productId, count);

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

    const order: Order = await this.source.getOrder(orderId);

    if (!order) {
      console.error("[getOrderItems] Not found", orderId);
      return;
    }

    console.log("[getOrderItems] order found", order);

    const products: Product[] = [] as Product[];

    for(const itemKey in order.items) {
      const product 
        = await CmsSearchSource.fetchProduct(itemKey) as Product;

      if(product) {
        products.push(product);
      }
    }

    console.log("[getOrderItems] products", products);

    return products;
  }
};

const controller = new OrdersController(source);

export default controller;
