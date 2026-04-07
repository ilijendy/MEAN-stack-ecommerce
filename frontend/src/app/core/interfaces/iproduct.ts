export interface Iproduct {
  _id:string;
  name:string;
  description:string;
  price:number;
  image:string;
  category:'laptop'|'mobile'|'accessory';
  stock:number;
  features?:string[];
  crreatedAt:string;
  updatedAt:string;
}
export interface ProductResponse {
  message?: string;
  count?: number;
  data: any;
}
