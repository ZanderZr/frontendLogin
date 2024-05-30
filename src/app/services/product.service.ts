import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hacer que el servicio esté disponible en toda la aplicación
})
export class ProductService {

  private myAppUrl: string; // URL base de la aplicación
  private myApiUrl: string; // URL base de la API

  private productSearchInputSource = new BehaviorSubject<ElementRef | null>(null); // BehaviorSubject para manejar el input de búsqueda
  productSearchInput$ = this.productSearchInputSource.asObservable(); // Observable del input de búsqueda

  constructor(private http: HttpClient) { // Inyección de dependencias de HttpClient
    this.myAppUrl = environment.endpoint; // Asignar la URL base de la aplicación desde las variables de entorno
    this.myApiUrl = 'api/productos/'; // Asignar la URL base de la API
  }

  // Devuelve un observable de tipo Product[] (array de productos)
  getListProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.myAppUrl + this.myApiUrl); // Realiza una solicitud GET para obtener la lista de productos
  }

  // Devuelve un observable de tipo Product[] filtrado por el término de búsqueda
  getProductsSearch(searchTerm: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}search/${searchTerm}`); // Realiza una solicitud GET para buscar productos
  }

  // Devuelve un observable de tipo void para eliminar un producto por ID
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`); // Realiza una solicitud DELETE para eliminar un producto
  }

  // Devuelve un observable de tipo Product para agregar un nuevo producto
  addProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.myAppUrl + this.myApiUrl, product); // Realiza una solicitud POST para añadir un producto
  }

  // Devuelve un observable de tipo Product para obtener un producto por ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.myAppUrl}${this.myApiUrl}${id}`); // Realiza una solicitud GET para obtener un producto por ID
  }

  // Devuelve un observable de tipo Product para actualizar un producto por ID
  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.myAppUrl}${this.myApiUrl}${id}`, product); // Realiza una solicitud PUT para actualizar un producto
  }

  // Establece el input de búsqueda y emite el nuevo valor a los suscriptores
  setProductSearchInput(input: ElementRef) {
    this.productSearchInputSource.next(input); // Emite el nuevo valor del input de búsqueda
  }

}