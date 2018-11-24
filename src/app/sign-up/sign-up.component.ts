import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  profileForm: FormGroup;
  signupSuccess = false;
  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private router: Router
    ) { }
  imageSrc:string;
  username: string;
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
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
    console.log(this.imageSrc);
    this.profileForm.value.category = this.selectedCategory
    this.username = e;
    console.log(this.profileForm.value);
    this.signupSuccess = true;
    this.http.post('/category', { 'category': this.selectedCategory, }).subscribe((catObj) => {
      this.profileForm.value.category = catObj[0].id;
    this.http.post("/signUp", this.profileForm.value).subscribe((data) => {
      console.log(data);
    })
  })
    this.router.navigateByUrl('/login');
  }
}