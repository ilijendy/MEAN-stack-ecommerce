import { Component, ChangeDetectorRef } from '@angular/core';
import { Iproduct } from '../../core/interfaces/iproduct';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/productservice';
import { CartService } from '../../core/services/cart';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product: Iproduct | null = null;
  loading: boolean = false;
  error: string | null = null;
  quantity: number = 1;
  cartMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Product ID from route:', id);
    if (id) this.loadProduct(id);
  }
  loadProduct(id: string) {
    this.loading = true;
    console.log('Fetching product details for ID:', id);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        console.log('Product data received:', data);
        this.product = data.data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.error = err.message || 'Failed to load product';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
  increaseQuantity(){
    if(this.product&&this.quantity<this.product.stock){
      this.quantity++;
    }
  }
  decreaseQuantity(){
    if(this.quantity>1){
      this.quantity--;
    }
  }
  addtoCart(){
    if(!this.authService.isLogIn()){
      this.router.navigate(['/login']);
      return;
    }
    if(this.product){
      this.cartService.addToCart(this.product._id,this.quantity).subscribe({
        next: (res) => {
         this.cartMessage='Product added to cart';
         setTimeout(()=>{
          this.cartMessage='';
         },3000);
        },
        error:(err)=>{
          this.cartMessage=err.message;
        }
      })
    }
  }
  
  
}
