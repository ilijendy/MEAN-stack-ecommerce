import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  orders: IOrder[] = [];
  loading = true;
  error = '';
  updatingStatusFor: string | null = null;
  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }
  get paginatedOrders(): IOrder[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.orders.slice(start, start + this.itemsPerPage);
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cdr.markForCheck();
  }

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
        this.currentPage = 1;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch orders';
        this.loading = false;
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.fetchOrders();
        this.updatingStatusFor = null;
      }
    });
  }
}
