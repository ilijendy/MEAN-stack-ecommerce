import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/productservice';
import { Iproduct } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-products',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  constructor(private productService: ProductService) { }
  products: Iproduct[] = [];
  filterProducts: Iproduct[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  categoreies =
    [{ label: 'All Products', value: 'all' },
    { label: 'Laptops', value: 'laptop' },
    { label: 'Mobiles', value: 'mobile' },
    { label: 'Accessories', value: 'accessory' }]
  error: string = '';
  loading: boolean = false;
  showTypeahead: boolean = false;
  typeaheadResults: Iproduct[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  get totalPages(): number {
    return Math.ceil(this.filterProducts.length / this.itemsPerPage);
  }
  get paginatedProducts(): Iproduct[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterProducts.slice(start, start + this.itemsPerPage);
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cdr.markForCheck();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  // Slider state
  currentSlide = 0;
  slides = [
    {
      title: 'Latest Laptops',
      description: 'Discover the hottest trending laptops for this season with up to 50% off.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'New Gadgets',
      description: 'Upgrade your tech with our latest arrivals and premium accessories.',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Work from Home',
      description: 'Create the perfect workspace with our ergonomic furniture.',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200'
    }
  ];
  slideInterval: any;

  ngOnInit(): void {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.products = res.data;
        this.filterProducts = res.data;
        this.loading = false;
        this.currentPage = 1;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.startSlider();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  startSlider() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopSlider() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopSlider();
    this.startSlider();
  }

  filterByCategory() {
    this.searchQuery = '';
    this.currentPage = 1;
    if (this.selectedCategory === "all") {
      this.filterProducts = this.products;
    }
    else {
      this.loading = true;
      this.productService.getProductByCatagory(this.selectedCategory).subscribe({
        next: (res) => {
          this.filterProducts = res.data;
          this.loading = false;
          this.currentPage = 1;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.filterProducts = [];
          this.error = 'Failed to load products';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  onSearchFocus() {
    if (this.searchQuery.trim().length > 0) {
      if (this.filterProducts.length > 0) {
        this.typeaheadResults = this.filterProducts.slice(0, 5);
      }
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

  selectTypeahead(product: Iproduct) {
    if (product && product.name) {
      this.searchQuery = product.name;
      this.showTypeahead = false;
      this.searchProducts();
    }
  }

  searchProducts() {
    this.selectedCategory = 'all';
    this.currentPage = 1;
    if (this.searchQuery.trim() === '') {
      this.filterProducts = this.products;
      this.showTypeahead = false;
      this.typeaheadResults = [];
    }
    else {
      this.productService.searchProduct(this.searchQuery).subscribe({
        next: (res) => {
          this.filterProducts = res.data;
          this.typeaheadResults = res.data.slice(0, 5);
          if (this.searchQuery.trim().length > 0) {
             this.showTypeahead = true;
          }
          this.loading = false;
          this.currentPage = 1;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.filterProducts = [];
          this.typeaheadResults = [];
          this.error = 'Failed to load products';
          this.loading = false;
          this.cdr.markForCheck();
        }
      })
    }
  }
}
