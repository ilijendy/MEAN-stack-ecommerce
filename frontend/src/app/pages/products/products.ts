import { Component, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/productservice';
import { Iproduct } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnDestroy {
  constructor(private productService:ProductService){}
  products:Iproduct[]=[];
  filterProducts:Iproduct[]=[];
  selectedCategory:string='all';
  searchQuery:string='';
  categoreies=
  [{label:'All Products',value:'all'},
   {label:'Laptops',value:'laptop'},
   {label:'Mobiles',value:'mobile'},
   {label:'Accessories',value:'accessory'}]
  error:string='';
  loading:boolean=false;

  // Slider state
  currentSlide = 0;
  slides = [
    {
      title: 'Summer Collection',
      description: 'Discover the hottest trends for this season with up to 50% off.',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200'
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
      next:(res)=>{
        this.products=res.data;
        this.filterProducts=res.data;
        this.loading=false;
        
      },
      error:(err)=>{
        this.error='Failed to load products';
        this.loading=false;
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
    this.startSlider(); // reset interval
  }

  filterByCategory(){
    if(this.selectedCategory==="all"){
      this.filterProducts=this.products;
    }
    else{
      this.productService.getProductByCatagory(this.selectedCategory).subscribe({
        next:(res)=>{
          this.filterProducts=res.data;
          this.loading=false;
        },
        error:(err)=>{
          this.error='Failed to load products';
          this.loading=false;
        }
      });
    }
    this.searchQuery='';
  }
  searchProducts(){
    if(this.searchQuery.trim()===''){
      this.filterProducts=this.products;
    }
    else{
      this.productService.searchProduct(this.searchQuery).subscribe({
        next:(res)=>{
          this.filterProducts=res.data;
          this.loading=false;
        },
        error:(err)=>{
          this.error='Failed to load products';
          this.loading=false;
        }
      })
    }
  }




}
