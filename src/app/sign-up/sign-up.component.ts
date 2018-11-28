import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  
  public logo = "assets/images/logo.png";
  profileForm: FormGroup;
  signupSuccess = false;
  constructor(
    private signupService: SignUpService,
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
      photoData:['']

    })
  }
  onSubmit(e) {
    this.profileForm.value.category = this.selectedCategory
    this.username = e;
    this.signupSuccess = true;
  this.signupService.addCategory(this.selectedCategory).subscribe((catObj) => {
    this.profileForm.value.category = catObj[0].id;
    this.signupService.addUser(this.profileForm.value).subscribe((data) => {
      console.log(data, 'service');
    })
  })
    this.router.navigateByUrl('/login');
  }
}