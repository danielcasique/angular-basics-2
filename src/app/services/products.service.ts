import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';

import { Product, CreateProductDTO, UpdateProductDto } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiURL = 'https://young-sands-07814.herokuapp.com/api/products';

  constructor(
    private http : HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number){
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiURL, {params})
    .pipe(
      retry(3)
    );
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiURL}/${id}`)
  }

  getProductByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiURL}`, {
      params: {limit, offset}
    })
  }

  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiURL, data);
  }

  update(id: string, dto: UpdateProductDto){
    return this.http.put<Product>(`${this.apiURL}/${id}`, dto);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiURL}/${id}`)
  }

}
