import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { MapsAPILoader } from '@agm/core';
declare var google: any;
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
  latlng: LatLng = {
    lat: 12,
    lng: 12
  };
  constructor(public mapsApiLoader: MapsAPILoader,
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router
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
      suggestedPay: ['$'],
      startTime:['']
    })
    this.selectedCategory = e;
  }
  getlatlng(address: string) {

    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({ "address": address }, (result, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.latlng.lat = result[0].geometry.location.lat();
        this.latlng.lng = result[0].geometry.location.lng();
      }
    })
    return this.latlng;
  }
  addChore() {
    this.choreForm.value.electedCategory = this.selectedCategory
    var addr = this.choreForm.value.address + "," + this.choreForm.value.city + "," + this.choreForm.value.zipcode
     var cordanits = this.getlatlng(addr);
    this.choreForm.value.cordanits = cordanits
    
    console.log(this.choreForm.value);
    this.http.post("/add",this.choreForm.value).subscribe((data) => {
      console.log(data);
      if (data === false) {
        this.router.navigateByUrl('/dashboard');

      } else {
      }
    })  
  }
}
