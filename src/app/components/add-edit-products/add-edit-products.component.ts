import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-edit-products',
  templateUrl: './add-edit-products.component.html',
  styleUrls: ['./add-edit-products.component.css']
})
export class AddEditProductsComponent implements OnInit {
  formVideojuego: FormGroup; // FormGroup para gestionar el formulario de producto
  loading: boolean = false; // Indicador de carga para mostrar spinners o deshabilitar botones
  id: number; // Identificador del producto a editar
  titulo: string = 'Agregar videojuego'; // Título del formulario, cambia según el contexto (agregar/editar)
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado

  constructor(private fb: FormBuilder, private _productService: ProductService,
    private router: Router, private toastr: ToastrService,
    private aRouter: ActivatedRoute, private _usersService: UsersService) {

    this.formVideojuego = this.fb.group({
      nombre: ['', Validators.required], 
      genero: ['', Validators.required], 
      precio: ['', Validators.required], 
      nota: ['', [Validators.required, Validators.maxLength(2)]] // Campo nota con validación requerida y longitud máxima de 2
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id')); // Obtener el id del producto desde la ruta
  }

  ngOnInit(): void {
    if(this.id != 0) { // Si el id no es 0, significa que estamos en modo edición
      this.titulo = 'Editar videojuego'; // Cambiar el título a "Editar videojuego"
      this.getProduct(this.id); // Cargar los datos del producto a editar
    }
  }

  // Método para manejar la selección de archivo
  onFileSelected(event: Event) { 
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0]; // Asignar el archivo seleccionado a selectedFile
    }
  }

  getProduct(id: number) {
    this.loading = true; // Mostrar indicador de carga
    this._productService.getProduct(id).subscribe((data: Product) => {
      this.loading = false; // Ocultar indicador de carga
      this.formVideojuego.setValue({
        nombre: data.nombre, // Establecer el valor del campo nombre con los datos del producto
        genero: data.genero, 
        precio: data.precio, 
        nota: data.nota 
      })
    })
  }

  addProduct() {
    const formData = new FormData();
    formData.append('nombre', this.formVideojuego.value.nombre); // Añadir el nombre al FormData
    formData.append('genero', this.formVideojuego.value.genero); 
    formData.append('precio', this.formVideojuego.value.precio); 
    formData.append('nota', this.formVideojuego.value.nota); 
    
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile); // Añadir la imagen seleccionada al FormData
    }

    this.loading = true; // Mostrar indicador de carga

    if (this.id !== 0) { // Si id no es 0, estamos en modo edición
      formData.append('id', this.id.toString()); // Añadir el id al FormData
      this._productService.updateProduct(this.id, formData).subscribe(() => {
        this.toastr.success('Videojuego editado', 'Editado'); // Mostrar notificación de éxito
        this.loading = false; // Ocultar indicador de carga
        this.router.navigate(['/']); // Navegar a la página principal
      });
    } else { // Si id es 0, estamos en modo agregar
      this._productService.addProduct(formData).subscribe(() => {
        this.toastr.success('Videojuego agregado', 'Agregado'); // Mostrar notificación de éxito
        this.loading = false; // Ocultar indicador de carga
        this.router.navigate(['/']); // Navegar a la página principal
      });
    }
  }
}
