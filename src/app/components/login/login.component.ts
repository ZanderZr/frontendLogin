import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private _usersService: UsersService, private toastr: ToastrService, 
    private router: Router) {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    if(this._usersService.getUser()){
      this.router.navigate(['/list']);  
    }
  }

  login() {

    const user = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    };

    this._usersService.login(user).subscribe({ // Llama al método login del servicio _usersService y se suscribe a la respuesta
      next: data => { // En caso de éxito (respuesta positiva)
        this._usersService.setToken(data.token); // Guarda el token recibido en el servicio _usersService
        this.router.navigateByUrl('/list'); // Redirige al usuario a la ruta '/list'
      },
      error: error => { // En caso de error (respuesta negativa)
        console.log(error); // Imprime el error en la consola
        this.toastr.error('Email o contraseña incorrectos', 'Error'); // Muestra un mensaje de error usando toastr
      }
    }
    );
  }
}

