import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { MapsAPILoader } from '@agm/core';
import { AddService } from '../add.service';
import { DashboardService } from '../dashboard.service';
import { ProfileService } from '../profile.service';
declare var google: any;
declare var stripe: any;

interface LatLng {
  lat: number;
  lng: number;
}
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent{
  geocoder: any;
  choreForm: FormGroup;
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  suggestedPay = [15, 20, 30, 40, 50];
  selectedPay: number;
  customer: any;
  public logo = "assets/images/logo.png";
  constructor(private addService: AddService,
    private dashboardService: DashboardService, 
    public mapsApiLoader: MapsAPILoader,
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router,
    private _profileService: ProfileService
  ) { 
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      console.log(this.geocoder);
    });
  }
    
  ngOnInit(e) {
    
    this.choreForm = this.formBuilder.group({
      // category: [''],
      description: [''],
      address: [''],
      city: [''],
      zipcode: [''],
      // suggestedPay: [''],
      //time needs to be converted to timestamp
      startTime:['']
    })
    this.selectedCategory = e;
    this.selectedPay = e;
  }
  getlatlng(address: string) {
    return new Promise((resolve,reject) =>{
      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({ "address": address }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.choreForm.value.lat = result[0].geometry.location.lat();
          this.choreForm.value.lng = result[0].geometry.location.lng();
        }
        resolve();
      })
    });
  }   
   addChore() {
    this.choreForm.value.electedCategory = this.selectedCategory
    this.choreForm.value.suggestedPay = this.selectedPay
    var addr = this.choreForm.value.address + "," + this.choreForm.value.city + "," + this.choreForm.value.zipcode

    this.getlatlng(addr).then(() => {

      console.log(JSON.stringify(this.choreForm.value));
      return this.dashboardService.searchCat(this.selectedCategory)    
    }).then((catObj) => {

      this.choreForm.value.category = catObj[0].id;
    }).then(() => {

     return  this.addService.addPost(this.choreForm.value)
    }).then(() => {

      // console.log(data, 'stripe id line 84');
      //add charge here 
      //add chore must charge user account for pay amount 
      //alert user of charge to account?
      //******************************************** */
      let payment = this.selectedPay.toString().concat('00');
      return this._profileService.chargeUser(payment);
      //******************************************** */
    })
    // .then((data) => {
    //   // console.log(data, 'stripe id line 84');
    //   //add charge here 
    //   //add chore must charge user account for pay amount 
    //   //alert user of charge to account?
    //   //******************************************** */
    //   let payment = this.selectedPay.toString().concat('00');
    //   this.customer = data;
    //   console.log(payment, data, 'payment and id');
    //   (async function () {
    //     const { charge, error } = stripe.charges.create({
    //       amount: payment, // amount of suggested payment plus 00 to convert to dollars
    //       currency: 'usd',
    //       customer: this.customer.id, // id from customer object
    //     });
    //     if (error) {
    //       console.log('Something is wrong:', error);
    //     } else {
    //       console.log("successful charge!", charge);
    //     }
    //   })();

    // //******************************************** */
    // })
    .then((data) => {
      if(data === true) {
        // console.log(data)
        alert("Job Posted!")
        this.router.navigateByUrl('/dashboard');
      } else {
        alert('Something went wrong');
        console.log('Something is wrong:', data);
      }
    });
  }
}
