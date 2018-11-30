import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUpService } from '../sign-up.service';
import {
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm } from '@angular/forms';

declare var stripe: any;
declare var elements: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cardInfo') cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  
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
    private router: Router,
    private cd: ChangeDetectorRef
    ) { }
  imageSrc:string;
  username: string;
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  customer:any;
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

  

  async onSubmitStripe(e) {
    /////////////// STRIPE ELEMENT ////////////////////
    if (this.profileForm.value.email.length < 10) {
      alert('Invalid email');
    } else {
      const { token, error } = await stripe.createToken(this.card);

      if (error) {
        console.log('Something is wrong:', error);
      } else {
        // console.log('Success!', token);
        // ...send the token to the your backend to process the charge
        this.http.post('/stripe/signup', {
          token,
          email: this.profileForm.value.email
        }).subscribe((data) => {
          // console.log(data, 'signup line 76')
          if (data !== false) {
            this.customer = data;
            this.profileForm.value.stripeId = this.customer.id;
            alert('Successful Stripe account creation!');
            // console.log(this.profileForm.value, 'signup line 81')
          } else {
            alert('Error creating Stripe account!');
          }
        });
      }
    } 
    ////////////// STRIPE ELEMENT ////////////////
  }
  
  onSubmit(e) {
    //alert user must upload photo!
    
    if (!this.customer) {
      alert('Please create account with Stripe to Sign up!')
    } else {
      this.profileForm.value.category = this.selectedCategory
      this.username = e;
      this.signupSuccess = true;
      this.http.post('/photo', { image: this.image }).subscribe((image) => {
        this.image = image
        this.imageUrl = this.image.url;
        console.log(this.imageUrl)

        this.signupService.addCategory(this.selectedCategory).subscribe((catObj) => {
          this.profileForm.value.category = catObj[0].id;
          this.profileForm.value.image = this.imageUrl;
          this.signupService.addUser(this.profileForm.value).subscribe((data) => {
            console.log(data, 'service');
            this.router.navigateByUrl('/login');
          })
        })
      })
    }

  }

  ngAfterViewInit() {
    const style = {
      base: {
        fontFamily: 'monospace',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'purple'
        }
      }
    };
    this.card = elements.create('card', { style });
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

}