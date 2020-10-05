import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss', './navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public authentic: Observable<boolean>;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authentic = this.auth.isAuthenticated();
  }

  signOut(){
    this.auth.signOut();
    this.router.navigate(['login']);
  }

}
