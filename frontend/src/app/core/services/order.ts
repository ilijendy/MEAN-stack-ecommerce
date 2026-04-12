import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder, OrderResponse, OrdersResponse, OrderStatsResponse } from '../interfaces/iorder';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  createOrder(): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, {});
  }

  getMyOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/myorders`);
  }

  getAllOrders(): Observable<OrderStatsResponse> {
    return this.http.get<OrderStatsResponse>(this.apiUrl);
  }

  getOrder(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: string, status: string): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}/status`, { status });
  }
}
