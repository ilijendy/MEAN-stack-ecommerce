import { Iproduct } from "./iproduct";
  export interface IcartItem{
    product:Iproduct;
    quantity:number;
  }
  export interface Icart {
    items:IcartItem[];
    totalPrice:number;
  }

