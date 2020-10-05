import { Component, OnInit } from '@angular/core';
import { AuthService } from './../service/auth.service';
import {AngularFireDatabase} from 'angularfire2/database';
import { Router } from '@angular/router';

 
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  public email: string;
  public password: string;
  public checkpassword: string;

  constructor(private auth: AuthService, private db: AngularFireDatabase, private router: Router) { }

  ngOnInit(): void {
  }

  registerEmail(){
    if(this.password !== this.checkpassword){
      alert("Senhas Diferentes!");
    }else{
      this.auth.registerEmail(this.email, this.password)
      .then( r =>{
        this.router.navigate(["dashboard"]);
      })
      .catch(e => console.log(e));
    }
  }
}
