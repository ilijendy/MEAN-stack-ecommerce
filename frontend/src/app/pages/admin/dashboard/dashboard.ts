// pages/admin/dashboard/dashboard.ts

import { Component, OnInit } from '@angular/core';
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

  // الإحصائيات
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  };

  recentOrders: any[] = [];
  loading: boolean = false;

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
        this.stats.totalProducts = res.count;
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.stats.totalOrders = res.count;
        this.stats.pendingOrders = res.orders.filter(
          o => o.status === 'pending'
        ).length;

        this.stats.totalRevenue = res.orders.reduce(
          (acc, o) => acc + o.totalAmount, 0
        );

        this.recentOrders = res.orders.slice(0, 5);

        this.loading = false;
      }
    });
  }
}