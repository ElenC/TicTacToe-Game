import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logarEmail(){
    this.auth.logarEmail(this.email, this.password)
    .then(u => this.router.navigate(["dashboard"]))
    .catch(err => console.log(err));
  }
}
