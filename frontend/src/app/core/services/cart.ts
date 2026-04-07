import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Icart, CartResponse } from '../interfaces/icart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
   private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  constructor(private http: HttpClient) {}

   getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/getCart`).pipe(
      tap(res => this.cartCountSubject.next(res.cart?.items?.length || 0))
    );
   }
   updateCart(productId:string,quantity:number):Observable<CartResponse>{
    return this.http.put<CartResponse>(`${this.apiUrl}/updateCart`,{productId, quantity}).pipe(
      tap(res => this.cartCountSubject.next(res.cart?.items?.length || 0))
    );
   }
   deleteCart(productId:string):Observable<CartResponse>{
    return this.http.delete<CartResponse>(`${this.apiUrl}/removeFromCart/${productId}`).pipe(
      tap(res => this.cartCountSubject.next(res.cart?.items?.length || 0))
    );
   }


  
  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addToCart`, { productId, quantity });
  }
  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clearCart`).pipe(
      tap(res => this.cartCountSubject.next(0))
    );
  }
}
