import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Icart } from '../../core/interfaces/icart';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: Icart | null = null;
  cartTotal: number = 0;
  loading: boolean = false;
  error: string | null = null;
  checkingOut = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res.cart;
        this.cartTotal = res.cartTotal || 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load cart';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    this.loading = true;
    this.cartService.updateCart(productId, quantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        this.error = err.message || 'Failed to update';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteCart(productId: string) {
    this.loading = true;
    this.cartService.deleteCart(productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        this.error = err.message || 'Failed to remove item';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  clearCart() {
    this.loading = true;
    this.cartService.clearCart().subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        this.error = err.message || 'Failed to clear cart';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  checkout() {
    this.checkingOut = true;
    this.error = null;
    this.cdr.markForCheck();

    this.orderService.createOrder().subscribe({
      next: () => {
        this.checkingOut = false;
        this.router.navigate(['/orders']);
      },
      error: (err: any) => {
        this.checkingOut = false;
        this.error = err.error?.message || 'Checkout failed. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
