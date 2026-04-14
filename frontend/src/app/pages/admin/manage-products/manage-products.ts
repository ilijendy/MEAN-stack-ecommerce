import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/productservice';
import { Iproduct } from '../../../core/interfaces/iproduct';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
})
export class ManageProducts implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  products: Iproduct[] = [];
  filteredProducts: Iproduct[] = [];
  loading = true;
  error = '';
  successMessage = '';

  // Form state
  showForm = false;
  isEditing = false;
  editingId: string | null = null;
  formData = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'laptop' as 'laptop' | 'mobile' | 'accessory',
    stock: 0,
  };
  imagePreview: string | null = null;

  // Search & Filter
  searchQuery = '';
  categoryFilter = '';
  showTypeahead = false;
  typeaheadResults: Iproduct[] = [];

  // Sort
  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
  get paginatedProducts(): Iproduct[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
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

  constructor(
    private productService: ProductService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getAllProduct().subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res.data) ? res.data : [];
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load products';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- Search, Filter, Sort ---
  applyFilters(): void {
    const q = (this.searchQuery || '').toLowerCase().trim();
    const cat = this.categoryFilter;
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch =
        (p.name?.toLowerCase() || '').includes(q) ||
        (p.category?.toLowerCase() || '').includes(q) ||
        (p.description?.toLowerCase() || '').includes(q);
      const matchesCategory = !cat || p.category === cat;
      return matchesSearch && matchesCategory;
    });
    this.typeaheadResults = q ? this.filteredProducts.slice(0, 5) : [];
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

  selectTypeahead(product: Iproduct) {
    this.searchQuery = product.name;
    this.showTypeahead = false;
    this.applyFilters();
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
    this.filteredProducts.sort((a: any, b: any) => {
      const valA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
      const valB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }

  // --- Form CRUD ---
  openAddForm() {
    this.showForm = true;
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
    this.cdr.markForCheck();
  }

  openEditForm(product: Iproduct) {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = product._id;
    this.formData = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    };
    this.cdr.markForCheck();
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
    this.cdr.markForCheck();
  }

  resetForm() {
    this.formData = {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'laptop',
      stock: 0,
    };
    this.imagePreview = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.formData.image = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    this.error = '';
    this.successMessage = '';

    if (this.isEditing && this.editingId) {
      this.productService.updateProduct(this.editingId, this.formData as any).subscribe({
        next: () => {
          this.successMessage = 'Product updated successfully!';
          this.showForm = false;
          this.fetchProducts();
          this.cdr.markForCheck();
          this.clearMessages();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to update product';
          this.cdr.markForCheck();
        }
      });
    } else {
      this.productService.createProduct(this.formData as any).subscribe({
        next: () => {
          this.successMessage = 'Product created successfully!';
          this.showForm = false;
          this.fetchProducts();
          this.cdr.markForCheck();
          this.clearMessages();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to create product';
          this.cdr.markForCheck();
        }
      });
    }
  }

  deleteProduct(id: string) {
    this.alertService.confirm('Delete Product?', 'Are you sure you want to delete this product? This action cannot be undone.', 'Yes, delete it!').then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.alertService.success('Deleted!', 'Product has been deleted.');
            this.successMessage = 'Product deleted!';
            this.fetchProducts();
            this.cdr.markForCheck();
            this.clearMessages();
          },
          error: (err: any) => {
            this.alertService.error('Error!', err.error?.message || 'Failed to delete product');
            this.error = err.error?.message || 'Failed to delete product';
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  private clearMessages() {
    setTimeout(() => {
      this.successMessage = '';
      this.error = '';
      this.cdr.markForCheck();
    }, 3000);
  }
}
