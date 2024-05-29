import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from '../interfaces/favorite';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient, private cookies: CookieService) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/favorites/'
  }

  getListFavorites(idUser: number): Observable<Product[]> {
        return this.http.get<Product[]>( this.myAppUrl + this.myApiUrl + idUser );
    }

  deleteFavorite(id: number):Observable<void> {
    return this.http.delete<void>( this.myAppUrl + this.myApiUrl + id );
   }

  addFavorite( favorite: Favorite ): Observable<void> {
    return this.http.post<void>( this.myAppUrl + this.myApiUrl, favorite );
  }

}
