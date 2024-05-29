import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent implements OnInit {

  @Input() boxProducts: Product[] = [];

  constructor() { }

  ngOnInit() { }

  getTotalPrice(): number {
    return this.boxProducts.reduce((total, product) => total + product.precio, 0); 
/*
  Primera Iteración:
    total = 0 (valor inicial)
    product = { nombre: 'Producto 1', precio: 10 }
    total + product.precio = 0 + 10 = 10

  Segunda Iteración:
    total = 10 (resultado de la iteración anterior)
    product = { nombre: 'Producto 2', precio: 20 }
    total + product.precio = 10 + 20 = 30

  Tercera Iteración:
    total = 30 (resultado de la iteración anterior)
    product = { nombre: 'Producto 3', precio: 30 }
    total + product.precio = 30 + 30 = 60 
*/
  }

}
