import { Iproduct } from "./iproduct";
  export interface IcartItem{
    product:Iproduct;
    quantity:number;
  }
  export interface Icart {
    _id: string;
    items:IcartItem[];
    totalPrice:number;
  }
  
  export interface CartResponse {
    message: string;
    cart: Icart;
    cartTotal: number;
  }

