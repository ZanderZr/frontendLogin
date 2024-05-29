import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario: String = ""

  constructor(private router: Router, private _usersService: UsersService) {

  }

  ngOnInit(): void {
    this._usersService.getUser().subscribe(
      (user: User) => {
        if (user && user.username) {
          this.usuario = "Bienvenido, " + user.username;
          
        } else {
          console.error('Usuario o nombre de usuario no definidos');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

}


