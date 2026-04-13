import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { IOrder } from '../../core/interfaces/iorder';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  orders: IOrder[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.orders || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.orders = [];
          this.error = '';
        } else {
          this.error = err.error?.message || 'Failed to load orders';
        }
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getStatusClass(status: string): string {
    return status;
  }

  cancelOrder(id: string) {
    this.alertService.confirm('Cancel Order?', 'Are you sure you want to cancel this order? This action cannot be undone.', 'Yes, cancel it!').then((result) => {
      if (result.isConfirmed) {
        this.orderService.cancelOrder(id).subscribe({
          next: () => {
            this.alertService.success('Cancelled!', 'Your order has been successfully cancelled.');
            this.fetchOrders();
          },
          error: (err: any) => {
            this.alertService.error('Error!', err.error?.message || 'Failed to cancel order.');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}

