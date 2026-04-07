import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, { productId, quantity });
  }
}
