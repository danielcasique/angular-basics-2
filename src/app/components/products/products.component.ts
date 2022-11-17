import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { Product, CreateProductDTO, UpdateProductDto } from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { switchMap } from 'rxjs/operators';
import { zip } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart : Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    description: '',
    category: {
      id: '',
      name: ''
    }
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error'  | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts(10, 0)
    .subscribe( data => {
      this.products = data;
    });
  }

  onAddToShoppingCar(product: Product){
    console.log(product);
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggelProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.toggelProductDetail();
    this.productsService.getProduct(id)
    .subscribe(data => {
//      console.log('product', data);

      this.productChosen = data;
      this.statusDetail = 'success';
    }, response => {
      window.alert(response);
      this.statusDetail = 'error';
    })
  }

  readAndUpdate(id: string){
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product) => this.productsService.update(product.id, {title : 'change'}))
    )
    .subscribe( data => {
      console.log(data);
    });

    this.productsService.fetchReadAndUpdate(id, {title: 'nuevo'})
    .subscribe(response => {
      const product = response[0];
      const update= response[1];
    });

  }

  createNewProduct(){
    const product : CreateProductDTO = {
      title: 'Nuevo Product',
      description: 'bla bla bla',
      images: ['https://placeimg.com/640/480/any'],
      price: 1000,
      categoryId: 2
    }
    this.productsService.create(product)
    .subscribe(data => {
      console.log(data);
      this.products.unshift(data);
    });
  }

  updateProduct(){
    const changes : UpdateProductDto = {
      title: 'nuevo title'
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe( data => {
      console.log('update', data);
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
    });
    this.toggelProductDetail();
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.toggelProductDetail();
    });
  }

  loadMore(): void {
    this.productsService.getProductByPage(this.limit, this.offset)
    .subscribe( data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
