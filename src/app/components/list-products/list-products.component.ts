import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'; // Importaciones necesarias
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService para mostrar notificaciones
import { Product } from 'src/app/interfaces/product'; // Importar la interfaz Product
import { ProductService } from 'src/app/services/product.service'; // Importar el servicio ProductService
import { FavoriteService } from 'src/app/services/favorite.service'; // Importar el servicio FavoriteService
import { UsersService } from 'src/app/services/user.service'; // Importar el servicio UsersService
import { Favorite } from 'src/app/interfaces/favorite'; // Importar la interfaz Favorite
import { User } from 'src/app/interfaces/user'; // Importar la interfaz User
import { debounceTime, distinct, filter, fromEvent, map, tap } from 'rxjs'; // Importar operadores y funciones de RxJS

@Component({
  selector: 'app-list-products', // Selector del componente
  templateUrl: './list-products.component.html', // URL del template del componente
  styleUrls: ['./list-products.component.css'] // URL de los estilos del componente
})
export class ListProductsComponent implements OnInit, AfterViewInit {

  @ViewChild('tabla') tabla!: ElementRef; // Obtén una referencia al elemento de la tabla

  productSearchInput!: ElementRef; // Referencia para el input de búsqueda

  listProducts: Product[] = []; // Lista de productos

  loading: boolean = false; // Indicador de carga

  boxProducts: Product[] = []; // Lista de productos en el carrito

  constructor(
    private _productService: ProductService, // Inyección de dependencias del servicio ProductService
    private _usersService: UsersService, // Inyección de dependencias del servicio UsersService
    private _favoriteService: FavoriteService, // Inyección de dependencias del servicio FavoriteService
    private toastr: ToastrService // Inyección de dependencias del servicio ToastrService
  ) {}

  ngOnInit(): void {
    this.getListProducts(); // Llama a getListProducts() al inicializar el componente
  }

  ngAfterViewInit(): void {
    this._productService.productSearchInput$.subscribe((input: ElementRef | null) => { // Suscríbete al observable productSearchInput$
      if (input) {
        this.productSearchInput = input; // Asigna el valor del input al productSearchInput
        this.setupSearch(this.productSearchInput); // Configura la búsqueda
      }
    });
  }

  getListProducts() {
    this.loading = true; // Activa el indicador de carga
    this._productService.getListProducts().subscribe((data: Product[]) => { // Suscríbete al observable getListProducts()
      this.listProducts = data; // Asigna los datos recibidos a listProducts
      this.loading = false; // Desactiva el indicador de carga
    });
  }

  deleteProduct(id: number) {
    this.loading = true; // Activa el indicador de carga
    this._productService.deleteProduct(id).subscribe(() => { // Suscríbete al observable deleteProduct()
      this.getListProducts(); // Vuelve a obtener la lista de productos
      this.toastr.warning('Videojuego eliminado', 'Eliminado'); // Muestra una notificación de advertencia
    });
  }

  addCarrito(id: number) {
    this.loading = true; // Activa el indicador de carga
    this._productService.getProduct(id).subscribe((data) => { // Suscríbete al observable getProduct()
      const product: Product = data; // Asigna los datos recibidos a product
      this.boxProducts.push(product); // Añade el producto a boxProducts
      this.loading = false; // Desactiva el indicador de carga
    });
  }

  addFav(idVideojuego: number) {
    this.loading = true; // Activa el indicador de carga

    let idUserActual: number; // Variable para almacenar el id del usuario actual

    this._usersService.getUser().subscribe({
      next: (user: User) => { // Maneja la respuesta cuando se obtiene el usuario
        if (user && user.id) { // Verifica si el usuario y su id existen
          idUserActual = user.id; // Asigna el id del usuario actual a la variable idUserActual

          const favorite: Favorite = {
            idUser: idUserActual, // Asigna el id del usuario al objeto favorite
            idVideojuego: idVideojuego // Asigna el id del videojuego al objeto favorite
          };

          this._favoriteService.addFavorite(favorite).subscribe({
            next: () => { // Maneja la respuesta cuando el favorito se añade correctamente
              this.toastr.success('Videojuego añadido a favoritos', 'Favorito'); // Muestra una notificación de éxito
              this.loading = false; // Desactiva el indicador de carga
            },
            error: (error) => { // Maneja la respuesta cuando ocurre un error al añadir el favorito
              if (error.status === 400 && error.error.msg === 'El favorito ya existe.') { // Verifica si el error es porque el favorito ya existe
                this.toastr.warning('El videojuego ya está en tus favoritos', 'Favorito duplicado'); // Muestra una notificación de advertencia
              } else {
                this.toastr.error('Error al agregar el favorito', 'Error'); // Muestra una notificación de error
              }
              this.loading = false; // Desactiva el indicador de carga
            }
          });
        }
      },
      error: (error) => { // Maneja la respuesta cuando ocurre un error al obtener el usuario
        console.error(error); // Muestra el error en la consola
        this.toastr.error('Error al obtener el usuario', 'Error'); // Muestra una notificación de error
        this.loading = false; // Desactiva el indicador de carga
      }
    });
  }

  sortBy(field: string, products: Product[]) {
    if (field === 'nombre' || field === 'genero' || field === 'precio' || field === 'nota') { // Verifica si el campo es válido
      products.sort((a, b) => { // Ordena los productos
        if (a[field] < b[field]) {
          return -1;
        }
        if (a[field] > b[field]) {
          return 1;
        }
        return 0;
      });
    } else {
      console.error('Campo de ordenación no válido:', field); // Muestra un mensaje de error en la consola
    }
  }
  
  setupSearch(productSearchInput: ElementRef): void {
    fromEvent<Event>(productSearchInput.nativeElement, 'keyup').pipe( // Crea un observable a partir del evento 'keyup'
      map((event: Event) => {
        const searchTerm = (event.target as HTMLInputElement).value; // Obtén el valor del input
        return searchTerm; // Devuelve el término de búsqueda
      }),
      // Metodos para optimizar recursos en la busqueda
      filter((searchTerm: string) => searchTerm.length > 3), // el input teien que ser mas de 3 caracteres para que busque
      debounceTime(500), // tras pasado medio segundo al dejar de escribir busca
      distinct(), // Si la busqueda es la misma que la anterior no hace nada

      tap((searchTerm: string) => console.log(searchTerm))
    ).subscribe((searchTerm: string) => {
      this.searchProducts(searchTerm); // Llama a searchProducts() con el término de búsqueda
    });
  }

  searchProducts(searchTerm: string) {
    if (searchTerm !== '') { // Verifica si el término de búsqueda no está vacío
      this._productService.getProductsSearch(searchTerm).subscribe({
        next: (data: Product[]) => {
          this.listProducts = data; // Actualiza la lista de productos mostrados
        },
        error: error => {
          console.error('Error al buscar productos:', error); // Muestra el error en la consola
        }
      });
    } else {
      this.getListProducts(); // Vuelve a obtener la lista de productos si el término de búsqueda está vacío
    }
  }
}
