import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Icart } from '../../core/interfaces/icart';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';

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
    private cdr: ChangeDetectorRef,
    private alertService: AlertService
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
      error: (err: any) => {
        this.error = err.error?.message || err.message || 'Failed to load cart';
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
      error: (err: any) => {
        this.error = err.error?.message || err.message || 'Failed to update';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteCart(productId: string) {
    this.alertService.confirm('Remove Item?', 'Are you sure you want to remove this item from your cart?', 'Yes, remove it!').then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.cartService.deleteCart(productId).subscribe({
          next: () => {
             this.alertService.success('Removed!', 'Item has been removed from your cart.');
             this.loadCart();
          },
          error: (err: any) => {
            const msg = err.error?.message || err.message || 'Failed to remove item';
            this.alertService.error('Error', msg);
            this.error = msg;
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  clearCart() {
    this.alertService.confirm('Clear Cart?', 'Are you sure you want to clear your entire cart?', 'Yes, clear it!').then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.cartService.clearCart().subscribe({
          next: () => {
            this.alertService.success('Cleared!', 'Your cart is now empty.');
            this.loadCart();
          },
          error: (err: any) => {
            const msg = err.error?.message || err.message || 'Failed to clear cart';
            this.alertService.error('Error', msg);
            this.error = msg;
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
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
