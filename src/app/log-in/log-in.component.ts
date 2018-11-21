// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-log-in',
//   templateUrl: './log-in.component.html',
//   styleUrls: ['./log-in.component.css']
// })
// export class LogInComponent implements OnInit {
//   loginForm: FormGroup;
//   constructor(private formBuilder: FormBuilder) { }

//   ngOnInit() {
//     this.loginForm = this.formBuilder.group({
//       username: [''],
//       password: ['']
//     })
//   }
//   onLogin() {
//     console.log(this.loginForm.value);
//   }

// }
import { Component } from '@angular/core';
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

  constructor(private router: Router, private http: HttpClient) {
  }

  tryLogin() {
      this.http.post("/login", {username: this.username, password: this.password}).subscribe((data) => {
        console.log(data);
        if (data === false) {
          this.router.navigateByUrl('/');

        }else{
          this.router.navigateByUrl('/dashboard');
        }
      })
    
    
  }
}