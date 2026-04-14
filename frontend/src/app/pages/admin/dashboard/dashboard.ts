// pages/admin/dashboard/dashboard.ts

import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/productservice';
import { OrderService } from '../../../core/services/order';
import { Iproduct } from '../../../core/interfaces/iproduct';
import { IOrder } from '../../../core/interfaces/iorder';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  stats = {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  };

  loading = true;
  activeTab: 'products' | 'orders' = 'products';

  // --- Products Datatable ---
  allProducts: Iproduct[] = [];
  filteredProducts: Iproduct[] = [];
  productSearch = '';
  productCategoryFilter = '';
  showProductTypeahead = false;
  productTypeaheadResults: Iproduct[] = [];
  productSortField = '';
  productSortDir: 'asc' | 'desc' = 'asc';
  productPage = 1;
  productPageSize = 6;

  get productTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.productPageSize);
  }
  get paginatedProducts(): Iproduct[] {
    const start = (this.productPage - 1) * this.productPageSize;
    return this.filteredProducts.slice(start, start + this.productPageSize);
  }
  get productPageNumbers(): number[] {
    const total = this.productTotalPages;
    const current = this.productPage;
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // --- Orders Datatable ---
  allOrders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  orderSearch = '';
  orderStatusFilter = '';
  showOrderTypeahead = false;
  orderTypeaheadResults: IOrder[] = [];
  orderSortField = '';
  orderSortDir: 'asc' | 'desc' = 'asc';
  orderPage = 1;
  orderPageSize = 6;

  get orderTotalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.orderPageSize);
  }
  get paginatedOrders(): any[] {
    const start = (this.orderPage - 1) * this.orderPageSize;
    return this.filteredOrders.slice(start, start + this.orderPageSize);
  }
  get orderPageNumbers(): number[] {
    const total = this.orderTotalPages;
    const current = this.orderPage;
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.productService.getAllProduct().subscribe({
      next: (res: any) => {
        this.allProducts = Array.isArray(res.data) ? res.data : [];
        this.stats.totalProducts = this.allProducts.length;
        this.filteredProducts = [...this.allProducts];
        this.cdr.markForCheck();
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.allOrders = res.orders || [];
        this.stats.totalOrders = res.count || this.allOrders.length;
        this.stats.pendingOrders = this.allOrders.filter(
          (o: any) => o.status === 'pending'
        ).length;
        this.stats.totalRevenue = this.allOrders.reduce(
          (acc: number, o: any) => acc + o.totalAmount, 0
        );
        this.filteredOrders = [...this.allOrders];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ---- Products: Search, Sort, Paginate ----
  filterProducts(): void {
    const q = (this.productSearch || '').toLowerCase().trim();
    const cat = this.productCategoryFilter;
    this.filteredProducts = this.allProducts.filter(p => {
      const matchesSearch =
        (p.name?.toLowerCase() || '').includes(q) ||
        (p.category?.toLowerCase() || '').includes(q) ||
        (p.description?.toLowerCase() || '').includes(q);
      const matchesCategory = !cat || p.category === cat;
      return matchesSearch && matchesCategory;
    });
    this.productTypeaheadResults = q ? this.filteredProducts.slice(0, 5) : [];
    if (this.productSortField) this.applySortProducts();
    this.productPage = 1;
    this.cdr.markForCheck();
  }

  onProductSearchFocus() {
    if (this.productSearch.trim().length > 0) {
       this.showProductTypeahead = true;
       this.cdr.markForCheck();
    }
  }

  onProductSearchBlur() {
    setTimeout(() => {
      this.showProductTypeahead = false;
      this.cdr.markForCheck();
    }, 200);
  }

  selectProductTypeahead(product: Iproduct) {
    this.productSearch = product.name;
    this.showProductTypeahead = false;
    this.filterProducts();
  }

  sortProducts(field: string): void {
    if (this.productSortField === field) {
      this.productSortDir = this.productSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.productSortField = field;
      this.productSortDir = 'asc';
    }
    this.applySortProducts();
    this.cdr.markForCheck();
  }

  private applySortProducts(): void {
    const dir = this.productSortDir === 'asc' ? 1 : -1;
    const field = this.productSortField;
    this.filteredProducts.sort((a: any, b: any) => {
      const valA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
      const valB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }

  changeProductPage(page: number): void {
    if (page < 1 || page > this.productTotalPages) return;
    this.productPage = page;
    this.cdr.markForCheck();
  }

  // ---- Orders: Search, Filter, Sort, Paginate ----
  filterOrders(): void {
    const q = (this.orderSearch || '').toLowerCase().trim();
    const status = this.orderStatusFilter;
    this.filteredOrders = this.allOrders.filter(o => {
      const matchesSearch =
        ((o._id || '').toLowerCase().includes(q)) ||
        ((o.user?.name || '').toLowerCase().includes(q)) ||
        ((o.user?.email || '').toLowerCase().includes(q));
      const matchesStatus = !status || o.status === status;
      return matchesSearch && matchesStatus;
    });
    this.orderTypeaheadResults = q ? this.filteredOrders.slice(0, 5) : [];
    if (this.orderSortField) this.applySortOrders();
    this.orderPage = 1;
    this.cdr.markForCheck();
  }

  onOrderSearchFocus() {
    if (this.orderSearch.trim().length > 0) {
       this.showOrderTypeahead = true;
       this.cdr.markForCheck();
    }
  }

  onOrderSearchBlur() {
    setTimeout(() => {
      this.showOrderTypeahead = false;
      this.cdr.markForCheck();
    }, 200);
  }

  selectOrderTypeahead(order: IOrder) {
    if (order && order._id) {
       this.orderSearch = order._id.slice(-6).toUpperCase();
       this.showOrderTypeahead = false;
       this.filterOrders();
    }
  }

  sortOrders(field: string): void {
    if (this.orderSortField === field) {
      this.orderSortDir = this.orderSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderSortField = field;
      this.orderSortDir = 'asc';
    }
    this.applySortOrders();
    this.cdr.markForCheck();
  }

  private applySortOrders(): void {
    const dir = this.orderSortDir === 'asc' ? 1 : -1;
    const field = this.orderSortField;
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

  changeOrderPage(page: number): void {
    if (page < 1 || page > this.orderTotalPages) return;
    this.orderPage = page;
    this.cdr.markForCheck();
  }
}