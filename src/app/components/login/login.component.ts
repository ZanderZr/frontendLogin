import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private _usersService: UsersService, private toastr: ToastrService, private router: Router) {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    if(this._usersService.getToken()){
      this.router.navigate(['/list']);
    }
  }

  login() {

    const user = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    };

    this._usersService.login(user).subscribe(
      data => {
        this._usersService.setToken(data.token);
        this.router.navigateByUrl('/list');
      },
      error => {
        console.log(error);
        // Si se produce un error, muestra un mensaje de error en un toast
        this.toastr.error('Email o contraseña incorrectos', 'Error');
      }
    );
  }
}

