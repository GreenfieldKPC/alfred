import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUser: boolean;
  public isCollapse: boolean = false;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private router : Router,
    private http: HttpClient,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    console.log(this.isLoggedIn$, 'loggedIn from navbar');
  }
 
  logout() {
    this.http.get("/logOut").subscribe((data) => {
      console.log(data);
      this.authService.logout();
      this.router.navigateByUrl('/');
    })

  }
}
