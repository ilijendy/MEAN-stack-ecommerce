import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Cart {
  items?: any[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
   private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  constructor(private http: HttpClient) {}

   getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(res => this.cartCountSubject.next(res.items?.length || 0))
    );
   }
   updateCart(productId:string,quantity:number):Observable<Cart>{
    return this.http.put<Cart>(`${this.apiUrl}/${productId}`,{quantity}).pipe(
      tap(res => this.cartCountSubject.next(res.items?.length || 0))
    );
   }
   deleteCart(productId:string):Observable<Cart>{
    return this.http.delete<Cart>(`${this.apiUrl}/${productId}`).pipe(
      tap(res => this.cartCountSubject.next(res.items?.length || 0))
    );
   }


  
  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { productId, quantity });
  }
  clearCart(): Observable<any> {
    return this.http.delete<Cart>(`${this.apiUrl}`).pipe(
      tap(res => this.cartCountSubject.next(0))
    );
  }
}
