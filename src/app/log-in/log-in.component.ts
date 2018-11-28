import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {

  username = '';
  password = '';
  loggedIn: boolean = false;
  public logo = "assets/images/logo.png";
  constructor(private router: Router, private http: HttpClient) {
  }
  @Output() logEvent = new EventEmitter<boolean>();
  sendlog(cb) {
    this.loggedIn = true;
    this.logEvent.emit(this.loggedIn);
    
    cb();
  }
  tryLogin() {
    this.http.post("/login", {username: this.username, password: this.password})
      .subscribe((data) => {
        if (data === true) {
          this.router.navigateByUrl('/dashboard');
          
        } else {
          this.router.navigateByUrl('/');
        }
      })
    
  }
}