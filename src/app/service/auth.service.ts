import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated: Observable<boolean>;
  private userId: string;

  constructor(private fb: AngularFireAuth) {
    this.authenticated = new Observable<boolean>((obsb) =>{
      fb.auth.onAuthStateChanged( (r) =>{
        if(r){
          this.userId = r.uid;
          obsb.next(true);
        }else{
          this.userId = '';
          obsb.next(false);
        }
      })
    })
   }

  registerEmail(email: string, password:string){
    return this.fb.auth.createUserWithEmailAndPassword(email,password);
  }

  logarEmail(email: string, password:string){
    return this.fb.auth.signInWithEmailAndPassword(email, password);
  }

  signOut(){
   this.fb.auth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  
}
