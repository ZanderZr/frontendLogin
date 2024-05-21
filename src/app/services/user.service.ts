import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
    private myAppUrl: string;
    private myApiUrl: string;
  
    constructor(private http: HttpClient, private cookies: CookieService) { 
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = 'api/users/'
    }
  
    login(user: User): Observable<any> {
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}login`, user);
    }

    register(user: User): Observable<any> {
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}register`, user);
    }

    setToken(token: string){
      this.cookies.set("token", token);
    }

    getToken() {
      return this.cookies.get("token");
    }

    getUser(): Observable<any> {

      const token = this.getToken();
      return this.http.post(`${this.myAppUrl}${this.myApiUrl}token`, token);
    }

    logout() {
      this.cookies.delete('token');
    }
  
}