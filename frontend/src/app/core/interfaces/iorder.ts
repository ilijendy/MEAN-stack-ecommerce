import { Iproduct } from "./iproduct";
import { Iuser } from "./iuser";

export interface orderItem{
  product:Iproduct;
  quantity:number;
  price:number;
}
export interface Order {
  _id: string;
  user: Iuser;
  items: orderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
}
export interface OrderResponse {
  count: number;
  orders: Order[];
}
export interface OrdersResponse {
  count: number;
  orders: Order[];
}
