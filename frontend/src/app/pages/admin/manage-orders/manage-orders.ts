import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order';
import { IOrder } from '../../../core/interfaces/iorder';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrders implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  loading = true;
  error = '';
  updatingStatusFor: string | null = null;
  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Search & Filter
  searchQuery = '';
  statusFilter = '';
  showTypeahead = false;
  typeaheadResults: IOrder[] = [];

  // Sort
  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }
  get paginatedOrders(): IOrder[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }
  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
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
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to fetch orders';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- Search, Filter, Sort ---
  applyFilters(): void {
    const q = (this.searchQuery || '').toLowerCase().trim();
    const status = this.statusFilter;
    this.filteredOrders = this.orders.filter(o => {
      const matchesSearch =
        ((o._id || '').toLowerCase().includes(q)) ||
        ((o.user?.name || '').toLowerCase().includes(q)) ||
        ((o.user?.email || '').toLowerCase().includes(q));
      const matchesStatus = !status || o.status === status;
      return matchesSearch && matchesStatus;
    });
    this.typeaheadResults = q ? this.filteredOrders.slice(0, 5) : [];
    if (this.sortField) this.applySort();
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  onSearchFocus() {
    if(this.searchQuery.trim().length > 0) {
       this.showTypeahead = true;
       this.cdr.markForCheck();
    }
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showTypeahead = false;
      this.cdr.markForCheck();
    }, 200);
  }

  selectTypeahead(order: IOrder) {
    if (order && order._id) {
       this.searchQuery = order._id.slice(-6).toUpperCase();
       this.showTypeahead = false;
       this.applyFilters();
    }
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applySort();
    this.cdr.markForCheck();
  }

  private applySort(): void {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    const field = this.sortField;
    this.filteredOrders.sort((a: any, b: any) => {
      let valA: any, valB: any;
      if (field === 'user') {
        valA = a.user?.name?.toLowerCase() || '';
        valB = b.user?.name?.toLowerCase() || '';
      } else {
        valA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
        valB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];
      }
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
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
          this.applyFilters(); // Re-apply filters to move sorting/filtering around
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
