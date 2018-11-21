import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  profileForm: FormGroup;
  signupSuccess = false;
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }
  username: string;
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: [''],
      password: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      email: [''],
      address: [''],
      city: [''],
      state: [''],
      zipcode: [''],
      country: [''],
      aptNumber: [''],

    })
  }
  onSubmit(e) {
    // this.profileForm.setValue({
    // });
    this.username = e;
    console.log(this.profileForm.value);
    console.log(this.signupSuccess);
    this.signupSuccess = true;
    this.http.post("/signup", this.profileForm.value).subscribe((data) => {
        console.log(data);
    })
  }
}
