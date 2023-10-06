export type OrderItem = {
  productId_: string;
  count_: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  keywords: string[];
  count?: number;
  unit?: string;
  description?: string;
};

export enum OrderStatus {
  OPEN = "OPEN",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
};

export type Order = {
  id: string;
  status: OrderStatus;
  items?: Record<string, OrderItem>;
  products?: Map<string, Product>;
};

export default Order;
