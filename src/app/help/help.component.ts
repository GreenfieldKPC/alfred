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
  complaintObj: any;
  al:any;
  geocoder: any;
  complaintForm: FormGroup;
  categoryLists = ['Unsafe conditions', 'No equipment', 'Harassment', 'Unable to complete job','Other'];
  jobsList = [];
  selectedCategory: string;
  selectedJob: any;
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
  bot = [];
  addComplaint() {
    console.log(this.complaintForm.value);


    console.log(this.selectedCategory);
    this.bot.push(this.complaintForm.value.title)
    this.http.post('/lex',this.complaintForm.value).subscribe((data) =>{
    this.al = data;
      if (this.al.dialogState !== 'ReadyForFulfillment'){
        this.bot.push(this.al.message);
      } else {
        let complaint = 'Thnak you ,your complaint has been filed one of our staff will be in touch soon.';
        console.log(this.jobs);
        this.jobs.forEach((job) =>{
          if (job.title === this.selectedCategory ){
            this.selectedJob = job;
          }
        })
        this.bot.push(complaint);
        console.log(this.al.slots);
       this.complaintObj = {},
          this.complaintObj.category =  this.al.slots.category
        this.complaintObj.description = this.al.slots.incident_details
        this.complaintObj.name = this.al.slots.name
        this.complaintObj.id_job = this.selectedJob.id

        this.http.post('/complaint', this.complaintObj).subscribe((data) =>{

        });
      }
})
  this.complaintForm.reset();
  }
}

