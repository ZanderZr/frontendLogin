import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Favorite } from 'src/app/interfaces/favorite';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UsersService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent  implements OnInit {

  listFavorites: Product[] = []
  idUser: number = 0
  image: string = ""

  constructor(private router: Router, private _favoriteService: FavoriteService, 
    private _usersService: UsersService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this._usersService.getUser().subscribe(
      (user: User)=>{
        if (user && user.id) {
          this.idUser = user.id;

          this.getListFavorites(this.idUser);
        } 
      },
      (error) => {
        console.error(error);
        console.error("token caducado")
      }
    )
    
  }

  getListFavorites(idUser : number) {
    // Asume que el servicio devuelve un array de productos favoritos
    this._favoriteService.getListFavorites(idUser).subscribe(
      (favorites: Product[]) => {
        this.listFavorites = favorites;
      },
      (error) => {
        console.error('Error al obtener los favoritos:', error);
      }
    );
  }

  getProductImageUrl(imagePath: string): string {
    if (imagePath) {
      return `http://localhost:3000/${imagePath.replace('\\', '/')}`;
    }else {
    return 'http://localhost:3000/uploads/error.png'; // Ruta de una imagen por defecto
  }
}

deleteFavorite(idUser: number, idVideojuego: number) {

  idUser = this.idUser

  this._favoriteService.deleteFavorite(idUser, idVideojuego).subscribe(() => {
    this.getListFavorites(this.idUser);
    this.toastr.warning('Videojuego eliminado de favoritos', 'Eliminado');
  })
}
}

