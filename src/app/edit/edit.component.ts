import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { MapsAPILoader } from '@agm/core';
import { AddService } from '../add.service';
import { DashboardService } from '../dashboard.service';
import { JobService } from '../job.service';
declare var google: any;
declare var stripe: any;

interface LatLng {
  lat: number;
  lng: number;
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent  {
  chore: any;
  geocoder: any;
  editForm: FormGroup;
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  suggestedPay = [15, 20, 30, 40, 50];
  selectedPay: number;
  customer: any;
  public logo = "assets/images/logo.png";
  constructor(private addService: AddService,
    private _jobService: JobService,
    private dashboardService: DashboardService,
    public mapsApiLoader: MapsAPILoader,
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router,
  ) {
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();

    });
  }

  ngOnInit(e) {
this.chore = this._jobService.getEditJob();
console.log(this.chore)
    this.editForm = this.formBuilder.group({
      // category: [''],
      title: [''],
      description: [''],
      // suggestedPay: [''],
      //time needs to be converted to timestamp
      startTime: ['']
    })
  }
  getlatlng(address: string) {
    return new Promise((resolve, reject) => {
      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({ "address": address }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.editForm.value.lat = result[0].geometry.location.lat();
          this.editForm.value.lng = result[0].geometry.location.lng();
        }
        resolve();
      })
    });
  }



  editChore() {
    this.editForm.value.id = this.chore.id
    console.log(this.editForm.value)
    this._jobService.editJob(this.editForm.value);
    this.router.navigateByUrl('/dashboard');
  }
}

