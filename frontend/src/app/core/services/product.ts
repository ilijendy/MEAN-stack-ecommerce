import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Iproduct, ProductResponse } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class Product {
  constructor(private http:HttpClient){}

  private apiUrl=environment.apiUrl+'/products';

  getAllProduct():Observable<ProductResponse>{
    return this.http.get<ProductResponse>(`${this.apiUrl}`);
  }

  getProductByCatagory(category?:string):Observable<ProductResponse>{
    let url=`${this.apiUrl}`;
    if(category){
      url+=`?category=${category}`;
    }
    return this.http.get<ProductResponse>(url);
  }

  searchProduct(search:string):Observable<ProductResponse>{
    let url=`${this.apiUrl}/search?product=${search}`;
    return this.http.get<ProductResponse>(url);
  }
  getProductById(id:string):Observable<ProductResponse>{
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }
  createProduct(product:Iproduct):Observable<ProductResponse>{
    return this.http.post<ProductResponse>(`${this.apiUrl}`,product);
  }
  updateProduct(id:string,product:Iproduct):Observable<ProductResponse>{
     return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`,product);
  }
  deleteProduct(id:string):Observable<ProductResponse>{
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`);
  }
}
