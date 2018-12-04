import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); 
  private employee = new BehaviorSubject<boolean>(false); 

  get isLoggedIn() {
    // console.log(this.loggedIn.asObservable(), 'trying auth service');
    return this.loggedIn.asObservable();
  }

  get isEmployee() {
    // console.log(this.employee.asObservable(), 'trying auth service');
    return this.employee.asObservable();
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
    this.employee.next(false);
    // this.router.navigate(['/login']);
  }

  employeeLogin(bool) {
    if (bool === true) {
      this.employee.next(true);
      // this.router.navigate(['/']);
    }
  }

}
