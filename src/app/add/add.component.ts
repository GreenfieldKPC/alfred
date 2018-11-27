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
      suggestedPay: [''],
      startTime:['']
    })
    this.selectedCategory = e;
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
    var addr = this.choreForm.value.address + "," + this.choreForm.value.city + "," + this.choreForm.value.zipcode
    this.getlatlng(addr).then(() => {
      console.log(JSON.stringify(this.choreForm.value));
      this.http.post('/category', { 'category': this.selectedCategory, }).subscribe((catObj) => {
          console.log(catObj);
        this.choreForm.value.category = catObj[0].id;
        this.http.post("/add", this.choreForm.value).subscribe((data) => {
          console.log(data);
        }) 
      })
      this.router.navigateByUrl('/dashboard');
    })
  }
}
