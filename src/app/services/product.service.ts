import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/productos/'
  }

  // Devuelve un observable de tipo Product que es un array
  getListProducts(): Observable<Product[]> {
    return this.http.get<Product[]>( this.myAppUrl + this.myApiUrl );
  }

  deleteProduct(id: number):Observable<void> {
   return this.http.delete<void>( this.myAppUrl + this.myApiUrl + id);
  }

  addProduct( product: Product ): Observable<void> {
    return this.http.post<void>( this.myAppUrl + this.myApiUrl, product );
  }

  getProduct(id:number):Observable<Product> {
    return this.http.get<Product>( this.myAppUrl + this.myApiUrl + id );
  }

  updateProduct(id:number, product:Product) : Observable<void> {
    return this.http.put<void>(this.myAppUrl + this.myApiUrl + id, product);
  }
}
