import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isUser: boolean;
  constructor(private router : Router) { }

  ngOnInit() {
  }
  logout() {
    this.isUser = false;
    if (this.isUser === false) {
      this.router.navigateByUrl('/');

    }
  }
}
