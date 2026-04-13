// pages/admin/dashboard/dashboard.ts

import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/productservice';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
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

  recentOrders: any[] = [];
  loading = true;

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
        this.stats.totalProducts = Array.isArray(res.data) ? res.data.length : (res.count || 0);
        this.cdr.markForCheck();
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.stats.totalOrders = res.count || res.orders?.length || 0;
        this.stats.pendingOrders = res.orders.filter(
          (o: any) => o.status === 'pending'
        ).length;

        this.stats.totalRevenue = res.orders.reduce(
          (acc: number, o: any) => acc + o.totalAmount, 0
        );

        this.recentOrders = res.orders.slice(0, 5);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}