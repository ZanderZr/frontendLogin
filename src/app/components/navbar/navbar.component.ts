import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductService } from 'src/app/services/product.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar', // Selector del componente
  templateUrl: './navbar.component.html', // URL del template del componente
  styleUrls: ['./navbar.component.css'] // URL de los estilos del componente
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @ViewChild('productSearchInput') productSearchInput!: ElementRef; // Referencia al input de búsqueda de productos

  usuario: String = ""; // Variable para almacenar el nombre de usuario
  private refreshSubscription: Subscription = new Subscription(); // Suscripción al observable refreshNavbar$
  isLogged: Boolean = false; // Indicador de sesión iniciada
  listProductsSearch: Product[] = []; // Lista de productos buscados

  constructor(
    private router: Router, // Inyección de dependencias del Router
    private _usersService: UsersService, // Inyección de dependencias del UsersService
    private _productService: ProductService // Inyección de dependencias del ProductService
  ) {}

  /*
  Se realiza la suscripción al observable refreshNavbar$ del servicio _usersService.
  Cuando este observable emite un valor, se llama a this.loadUser() para actualizar
  la información del usuario en la navbar.
  */
  ngOnInit(): void {
    this.refreshSubscription = this._usersService.refreshNavbar$.subscribe(() => {
      this.loadUser(); // Llama a loadUser() cuando refreshNavbar$ emite un valor
    });
    this.loadUser(); // Cargar el usuario inicialmente
  }

  ngAfterViewInit(): void {
    this._productService.setProductSearchInput(this.productSearchInput); // Establecer el input de búsqueda en el servicio ProductService
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Cancelar la suscripción cuando se destruya el componente
    }
  }

  private loadUser(): void {
    this._usersService.getUser().subscribe(
      (user: User) => {
        if (user && user.username) { // Verificar si el usuario y su nombre de usuario existen
          this.usuario = "Bienvenido, " + user.username; // Actualizar el nombre de usuario
          this.isLogged = true; // Marcar que la sesión está iniciada
        } else {
          console.error('Usuario o nombre de usuario no definidos'); // Mostrar error en consola
          this.usuario = ""; // Vaciar el nombre de usuario
        }
      },
      (error) => {
        console.error(error); // Mostrar error en consola
        this.usuario = ""; // Vaciar el nombre de usuario
      }
    );
  }

  logout(): void {
    this._usersService.logout(); // Llamar al método logout del servicio UsersService
    this.router.navigate(['/login']); // Navegar a la página de login
    this.isLogged = false; // Marcar que la sesión no está iniciada
  }
}