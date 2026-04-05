import { Component, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/productservice';
import { Iproduct } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
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
    })
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
