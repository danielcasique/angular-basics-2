import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '../../models/product.model'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  @Input() product : Product = {
    id: '',
    price: 0,
    image: '',
    title: '',
    description: '',
    category: ''
  };

  @Output() addedProduct = new EventEmitter<Product>();

  constructor() { }

  onAddtoCart(){
    this.addedProduct.emit(this.product);
  }

}
