import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/productservice';
import { Iproduct } from '../../../core/interfaces/iproduct';

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

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }
  get paginatedProducts(): Iproduct[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cdr.markForCheck();
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getAllProduct().subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res.data) ? res.data : [];
        this.loading = false;
        this.currentPage = 1;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load products';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

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
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.successMessage = 'Product deleted!';
        this.fetchProducts();
        this.cdr.markForCheck();
        this.clearMessages();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to delete product';
        this.cdr.markForCheck();
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
