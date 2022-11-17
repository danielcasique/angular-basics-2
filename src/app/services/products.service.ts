import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';

import { Product, CreateProductDTO, UpdateProductDto } from './../models/product.model';

import { environment } from './../../environments/environment';
import { throwError, zip } from 'rxjs';
import { checkTime } from './../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiURL =  `${environment.API_URL}/api/products`;

  constructor(
    private http : HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number){
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiURL, {params, context: checkTime()})
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes : .19 * item.price
        }
      }))
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDto){
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    );
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiURL}/${id}`)
    .pipe(
      catchError((error : HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict){
          return throwError('Ups algo esta fallando en el servier');
        }
        if(error.status === HttpStatusCode.NotFound){
          return throwError('El producto no existe');
        }
        if(error.status === HttpStatusCode.Unauthorized){
          return throwError('no estas autorizado');
        }
        return throwError('Ups algo salio mal');
      })
    )
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
