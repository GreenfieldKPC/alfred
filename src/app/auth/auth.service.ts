import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); 

  get isLoggedIn() {
    // console.log(this.loggedIn.asObservable(), 'trying auth service');
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router
  ) { }

  login(bool) {
    if (bool === true) { 
      this.loggedIn.next(true);
      // this.router.navigate(['/']);
    }
  }

  logout() {                            
    this.loggedIn.next(false);
    // this.router.navigate(['/login']);
  }
}
