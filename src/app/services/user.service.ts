import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { CookieService } from "ngx-cookie-service";
import { Subject, of, tap } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class UsersService {
    private myAppUrl: string;
    private myApiUrl: string;
    private refreshNavbarSubject = new Subject<void>();
  
    constructor(private http: HttpClient, private cookies: CookieService) { 
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = 'api/users/'
    }
  
    // La función tap de RxJS se usa para realizar efectos secundarios, en este caso, establecer el token, sin alterar el flujo del observable.
    login(user: User): Observable<any> {
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}login`, user).pipe(
        tap((response: any) => {
          this.setToken(response.token);
        })
      );
    }

    register(user: User): Observable<any> {
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}register`, user);
    }

    setToken(token: string){
      this.cookies.set("token", token);
      this.refreshNavbarSubject.next(); // Emisor
    }

    getToken() {
      return this.cookies.get("token");
    }

    getUser(): Observable<any> {
      const token = this.getToken();
      if (token) {
        return this.http.post(`${this.myAppUrl}${this.myApiUrl}token`, { token: token });
      } else {
        console.error('No se proporcionó ningún token');
        return of(null);
      }
    }

    logout() {
      this.cookies.delete('token');
      this.refreshNavbarSubject.next(); // Emisor
    }

    /*
    El getter refreshNavbar$ en el UsersService es una propiedad de solo lectura que devuelve un Observable 
    de tipo void. Este Observable se emite cada vez que se llama a this.refreshNavbarSubject.next(). El propósito 
    de este observable es permitir que otros componentes se suscriban a él para recibir notificaciones cuando se 
    debe actualizar la interfaz de usuario, como después de un inicio o cierre de sesión.
    */
    get refreshNavbar$(): Observable<void> {
      return this.refreshNavbarSubject.asObservable();
    }
  
}