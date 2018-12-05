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
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  geocoder: any;
  complaintForm: FormGroup;
  categoryLists = ['Unsafe conditions', 'No equipment', 'Harassment', 'Unable to complete job','Other'];
  jobsList = [];
  selectedCategory: string;
  selectedJob: string;
  imageFile: any;
  image: any;
  imageUrl:any;
  customer: any;
  jobs:any;
  job:any;
  string:any;
  userMess:any = [];
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

  previewFile() {
    var files = (<HTMLInputElement>document.getElementById('photo')).files
    this.imageFile = files[0]
    var reader = new FileReader();

    reader.addEventListener("load", () => {
      this.image = reader.result;
    }, false);

    if (this.imageFile) {
      reader.readAsDataURL(this.imageFile);
    }

  }

  ngOnInit(e) {
    this.jobs = [];
    this._jobService.getUserJobsTaken().then(data => {
    for (var job in data){
      this.jobs.push(data[job])
    }
      
    });
    this._jobService.getUserJobsPosted().then(data => {
      for (var job in data) {
        this.jobs.push(data[job])
      }
      ;
      for (var i = 0; i < this.jobs.length; i++) {
        this.jobsList.push(this.jobs[i].title)
      }
    });

    this.complaintForm = this.formBuilder.group({
      title: [''],
    

    })
    this.selectedCategory = e;
    this.selectedJob = e;
    
  }
  show(e) {
    this.string = e;
    this.userMess.push(this.string);
    this.string = '';
    // result.push(this.string);
    // this.userMess.concat(result);
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

    this.complaintForm.value.category = this.selectedCategory;
this.http.post('/lex',this.complaintForm.value).subscribe((data) =>{

})
  }
}

