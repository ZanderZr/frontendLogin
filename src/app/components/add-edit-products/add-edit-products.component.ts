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
  formVideojuego: FormGroup;
  loading: boolean = false;
  id: number;
  titulo: string = 'Agregar videojuego';

  // Formularios reactivos
  constructor(private fb: FormBuilder, private _productService: ProductService,
    private router: Router, private toastr: ToastrService,
    private aRouter: ActivatedRoute, private _usersService: UsersService ) {

    this.formVideojuego = this.fb.group({
      nombre: ['', Validators.required],
      genero: ['', Validators.required],
      precio: ['', Validators.required],
      nota: ['', [Validators.required, Validators.maxLength(2)]],
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {

    if(this.id !=0) {
      this.titulo = 'Editar videojuego';
      this.getProduct(this.id);
    }
    
  }

  getProduct(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data:Product) => {
      this.loading = false;
      this.formVideojuego.setValue({
        nombre: data.nombre,
        genero: data.genero,
        precio: data.precio,
        nota: data.nota
      })
    })
  }

  addProduct(){

    const product: Product ={
        nombre: this.formVideojuego.value.nombre,
        genero: this.formVideojuego.value.genero,
        precio: this.formVideojuego.value.precio,
        nota: this.formVideojuego.value.nota
    }
    
    this.loading = true;

    if(this.id !== 0){
      // EDITAR
      
      product.id = this.id;
      this._productService.updateProduct(this.id, product).subscribe(() => {
      this.toastr.success('Videojuego editado', 'Editado');

      this.loading = false;
      this.router.navigate(['/']);
      })

    } else {
      // AGREGAR

      this._productService.addProduct(product).subscribe(() => {
      this.toastr.success('Videojuego agregado', 'Agregado');
      
      this.loading = false;
      this.router.navigate(['/']);
    })
    }   
  }  
}
