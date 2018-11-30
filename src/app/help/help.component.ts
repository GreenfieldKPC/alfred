import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { MapsAPILoader } from '@agm/core';
import { AddService } from '../add.service';
import { DashboardService } from '../dashboard.service';
declare var google: any;
declare var stripe: any;

interface LatLng {
  lat: number;
  lng: number;
}
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  geocoder: any;
  complaintForm: FormGroup;
  categoryLists = ['Unsafe conditions', 'No equipment', 'Harassment', 'Unable to complete job','Other'];
  selectedCategory: string;
  imageFile: any;
  image: any;
  imageUrl:any;
  customer: any;
  public logo = "assets/images/logo.png";
  constructor(private addService: AddService,
    private dashboardService: DashboardService,
    public mapsApiLoader: MapsAPILoader,
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router,
  ) {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      console.log(this.geocoder);
    });
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

  ngOnInit(e) {

    this.complaintForm = this.formBuilder.group({
      // category: [''],
      description: [''],
      address: [''],
      city: [''],
      zipcode: [''],
      // suggestedPay: [''],
      //time needs to be converted to timestamp

    })
    this.selectedCategory = e;
    
  }
  getlatlng(address: string) {
    return new Promise((resolve, reject) => {
      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({ "address": address }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.complaintForm.value.lat = result[0].geometry.location.lat();
          this.complaintForm.value.lng = result[0].geometry.location.lng();
        }
        resolve();
      })
    });
  }
  addComplaint() {
    this.complaintForm.value.electedCategory = this.selectedCategory
     console.log(this.complaintForm.value);
    var addr = this.complaintForm.value.address + "," + this.complaintForm.value.city + "," + this.complaintForm.value.zipcode
    this.complaintForm.value.addr = addr;
    this.http.post('/category', { category: this.complaintForm.value.electedCategory} ).subscribe((category) =>{
      this.complaintForm.value.category = category[0].id
    this.http.post('/photo', { image: this.image }).subscribe((image) => {
      this.image = image
      this.imageUrl = this.image.url;
      this.complaintForm.value.image = this.imageUrl
      console.log(this.imageUrl)
      this.http.post('/complaint',this.complaintForm.value).subscribe((data) =>{
        console.log(data)
      })
    });
  })
  }
}

