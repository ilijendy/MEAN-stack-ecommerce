export interface OrderItem {
  product: any;
  quantity: number;
  price: number;
  _id?: string;
}

export interface IOrder {
  _id: string;
  user: any;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatsResponse {
  count: number;
  orders: IOrder[];
}

export interface OrderResponse {
  message: string;
  order: IOrder;
}

export interface OrdersResponse {
  message: string;
  orders: IOrder[];
}
