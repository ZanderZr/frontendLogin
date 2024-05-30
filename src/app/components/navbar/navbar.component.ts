import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductService } from 'src/app/services/product.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  
  @ViewChild('productSearchInput') productSearchInput!: ElementRef;
  usuario: String = ""
  private refreshSubscription: Subscription = new Subscription(); // se utiliza para representar una suscripción a un observable
  isLogged: Boolean = false;
  listProductsSearch: Product[] = [];

  constructor(private router: Router, private _usersService: UsersService, private _productService: ProductService) {
  
  }

  /*
  Aquí se realiza la suscripción al observable refreshNavbar$ del servicio _usersService.
  Cuando este observable emite un valor (en este caso, un valor de tipo void), se ejecuta
  la función de flecha proporcionada como argumento para subscribe. En este caso, la función
  de flecha llama a this.loadUser(), lo que probablemente signifique que se actualizará la
  información del usuario en el navbar cuando se produzca un evento de actualización.
  */

  ngOnInit(): void {
    this.refreshSubscription = this._usersService.refreshNavbar$.subscribe(() => {
     this.loadUser();
    });
    this.loadUser(); // Cargar el usuario inicialmente
  }

  ngAfterViewInit(): void {
    this._productService.setProductSearchInput(this.productSearchInput);
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private loadUser(): void {
    this._usersService.getUser().subscribe(
      (user: User) => {
        if (user && user.username) {
          this.usuario = "Bienvenido, " + user.username;
          this.isLogged = true;
        } else {
          console.error('Usuario o nombre de usuario no definidos');
          this.usuario = "";
        }
      },
      (error) => {
        console.error(error);
        this.usuario = "";
      }
    );
  }

  logout(): void {
    this._usersService.logout();
    this.router.navigate(['/login']);
    this.isLogged = false;
  }
  
}