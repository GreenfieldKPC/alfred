import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUpService } from '../sign-up.service';
import { any } from 'bluebird';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  
  public logo = "assets/images/logo.png";
  image: any;
  imageFile: any;
  imageUrl: any;
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
previewFile() {
  console.log('its firing')
  var files = (<HTMLInputElement>document.getElementById('photo')).files
    this.imageFile = files[0]
    console.log(this.imageFile)
  var reader = new FileReader();

  reader.addEventListener("load", () => {
   this.image = reader.result;
  }, false);

  if (this.imageFile) {
    reader.readAsDataURL(this.imageFile);
  }

}
  
  onSubmit(e) {
    this.username = e;
    this.signupSuccess = true;
    this.http.post('/photo',{image: this.image}).subscribe((image)=>{
    this.image = image
    this.imageUrl = this.image.url;
    console.log(this.imageUrl)

      this.signupService.addCategory(this.selectedCategory).subscribe((catObj) => {
        this.profileForm.value.category = catObj[0].id;
        this.profileForm.value.image = this.imageUrl;
        this.signupService.addUser(this.profileForm.value).subscribe((data) => {
          console.log(data, 'service');
        })
      })
    })
    this.router.navigateByUrl('/login');
  }
}