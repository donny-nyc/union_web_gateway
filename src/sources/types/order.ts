export type OrderItem = {
  id: string;
  count: number;
};

export enum OrderStatus {
  OPEN = "OPEN",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
};

export type Order = {
  id: string;
  status: OrderStatus;
  items?: Map<string, OrderItem>;
};

export default Order;
