import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UsersService } from 'src/app/services/user.service';
import { Favorite } from 'src/app/interfaces/favorite';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  listProducts: Product[] = []

  loading: boolean = false;

  boxProducts: Product[] = [];

  constructor(private _productService: ProductService, private _usersService: UsersService, private _favoriteService: FavoriteService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getListProducts();
  }

  getListProducts() {
    this.loading = true;
    this._productService.getListProducts().subscribe((data: Product[]) => {
      this.listProducts = data;
      this.loading = false;
    })
  }

  deleteProduct(id: number) {
    this.loading = true;
    this._productService.deleteProduct(id).subscribe(() => {
      this.getListProducts();
      this.toastr.warning('Videojuego eliminado', 'Eliminado');
    })
  }

  addCarrito(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data) => {
      const product: Product = data;
      this.boxProducts.push(product); // Asigna el producto favorito
      this.loading = false;
    });
  }

  addFav(idVideojuego: number) {
    this.loading = true;

    let idUserActual: number;

    this._usersService.getUser().subscribe({
      next: (user: User) => {  // Maneja la respuesta cuando se obtiene el usuario.
        if (user && user.id) { // Verifica si el usuario y su id existen.
          idUserActual = user.id; // Asigna el id del usuario actual a la variable idUserActual.

          const favorite: Favorite = {
            idUser: idUserActual, // Asigna el id del usuario al objeto favorite.
            idVideojuego: idVideojuego // Asigna el id del videojuego al objeto favorite.
          }

          this._favoriteService.addFavorite(favorite).subscribe({
            next: () => { // Maneja la respuesta cuando el favorito se añade correctamente.
              this.toastr.success('Videojuego añadido a favoritos', 'Favorito'); 
              this.loading = false;
            },
            error: (error) => { // Maneja la respuesta cuando ocurre un error al añadir el favorito.
              if (error.status === 400 && error.error.msg === 'El favorito ya existe.') { // Verifica si el error es porque el favorito ya existe.
                this.toastr.warning('El videojuego ya está en tus favoritos', 'Favorito duplicado');
              } else {
                this.toastr.error('Error al agregar el favorito', 'Error'); 
              }
              this.loading = false; 
            }
          });
        }
      },
      error: (error) => { // Maneja la respuesta cuando ocurre un error al obtener el usuario.
        console.error(error); 
        this.toastr.error('Error al obtener el usuario', 'Error'); // Muestra un mensaje de error al obtener el usuario.
        this.loading = false;
      }
    });
  }
}