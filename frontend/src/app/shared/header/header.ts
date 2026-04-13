import { Component, inject, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  authService = inject(Auth);
  cartService = inject(CartService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isMenuOpen = false;
  cartCount = 0;
  dropdownOpen = false;

  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.cdr.markForCheck();
    });

    if (this.authService.isLogIn()) {
      this.cartService.getCart().subscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.dropdownOpen = false;
      this.cdr.markForCheck();
    }
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.Logout();
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }
}
