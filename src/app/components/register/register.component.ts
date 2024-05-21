import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formRegister: FormGroup;

  constructor(private fb: FormBuilder, private _usersService: UsersService, private toastr: ToastrService) {

    this.formRegister = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    })
  }

  register() {

    if( this.formRegister.value.password1 === this.formRegister.value.password2 ){

    const user = {
      username: this.formRegister.value.username,
      email: this.formRegister.value.email,
      password: this.formRegister.value.password1
    };

    this._usersService.register(user).subscribe(
      data => {
        this._usersService.setToken(data.token);
      },
      error => {
        console.log(error);
        // Si se produce un error, muestra un mensaje de error en un toast
        this.toastr.warning('Email o username existen', 'Warning');
      });
    } else {
      this.toastr.warning('Las contraseñas debes ser iguales', 'Warning');
    }
  }
}
