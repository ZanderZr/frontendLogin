import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

  constructor(private router: Router, private _usersService: UsersService){

  }
  
  ngOnInit(): void {

    // PUEDE QUE AQUI DEBA IR this._userService.getUser()
    if(this._usersService.getToken()){
      this.router.navigate(['/list']);  
    }
  }

}
