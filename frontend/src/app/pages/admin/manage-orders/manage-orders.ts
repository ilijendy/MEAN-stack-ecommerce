import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order';
import { IOrder } from '../../../core/interfaces/iorder';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  orders: IOrder[] = [];
  loading = true;
  error = '';
  updatingStatusFor: string | null = null;
  statusOptions = ['pending', 'processing', 'delivered', 'cancelled'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.orders || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch orders';
        this.loading = false;
      }
    });
  }

  changeStatus(orderId: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    
    this.updatingStatusFor = orderId;
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (res) => {
        const index = this.orders.findIndex((o) => o._id === orderId);
        if (index !== -1 && res.order) {
          this.orders[index] = res.order;
        }
        this.updatingStatusFor = null;
      },
      error: (err) => {
        console.error('Failed to update status', err);
        // Revert UI to match actual state if we failed
        this.fetchOrders();
        this.updatingStatusFor = null;
      }
    });
  }
}
