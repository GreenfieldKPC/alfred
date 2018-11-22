import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUser: boolean;
  public isCollapse: boolean = false;
  constructor(
    private router : Router,
    private http: HttpClient
    ) { }

  ngOnInit() {
  }
  // logout() {
  //   this.isUser = false;
  //   if (this.isUser === false) {
  //     this.router.navigateByUrl('/');

  //   }
  // }
  logout() {
    this.http.get("/logOut").subscribe((data) => {
      console.log(data);
      this.router.navigateByUrl('/');
    })


  }
}
