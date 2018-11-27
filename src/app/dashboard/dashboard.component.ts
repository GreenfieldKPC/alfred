import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, observable } from 'rxjs';
import { DashboardService } from '../dashboard.service';

declare var google: any;


interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;

}
interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})


export class DashboardComponent implements OnInit {
  lat: number;
  lng: number;
  categoryLists = ['All', 'House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  public userChores = [
    {
      marker: {
        lat: 29.951065,
        lng: -90.071533,
        draggable: true
      }
    },
    {
      marker: {
        lat: 29.942662896,
        lng: -90.07583303,
        draggable: true
      }
    },
    {
      marker: {
        lat: 29.9505,
        lng: -90.0753,
        draggable: true
      }
    },
  ];
  geocoder: any;
  public location: Location = {
    lat: 30.433283,
    lng: -87.240372,
    marker: {
      lat: 29.9505,
      lng: -90.0753,
      draggable: true
    },

    zoom: 12
  };
  user: any;
  jobs: any;
  searchedObj: object;
  obj = {
    lat: 12,
    lng: 12,
  }
  searchJob: any;
  searchUser: any;
  test: any;
  test2: string = '2539 Columbus Street, New Orleans, LA';
  infoWindow = new google.maps.InfoWindow();
  @ViewChild(AgmMap) map: AgmMap;
  constructor(
    private dashboardService: DashboardService,
    public mapsApiLoader: MapsAPILoader, private router: Router, private http: HttpClient,
    private zone: NgZone,
    private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      // console.log(this.geocoder);
    });
  }

  addInfoWindow(marker, content, markerIndex) {
    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.setContent(content);
      this.infoWindow.open(this, marker);
    });
  }
  getlatlng(address: string) {
    return new Promise((resolve, reject) => {

      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({ "address": address }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.lat = result[0].geometry.location.lat();
          this.lng = result[0].geometry.location.lng();
        }
      })
      resolve();
      this.map.triggerResize();
    });
  }
  updateOnMap() {
    this.findLocation(this.location.address_state);
  }

  takeChore(job) {
    this.dashboardService.takeChore(job).subscribe((data) => {
      console.log(data, 'dashboard');
      // update job with doer of current user id
    alert("Added to My Chores!"); 
    })
  }

  findLocation(address) {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types
          if (types.indexOf('country') != -1) {
            this.location.address_country = results[0].address_components[i].long_name
          }
          if (types.indexOf('postal_code') != -1) {
            this.location.address_zip = results[0].address_components[i].long_name
          }
          if (types.indexOf('administrative_area_level_1') != -1) {
            this.location.address_state = results[0].address_components[0].long_name
          }
        }

        if (results[0].geometry.location) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize()

      } else {
        alert("Sorry, this search produced no results.");
      }
    })

  }

  logOut() {
    this.http.get("/logOut").subscribe((data) => {
      console.log(data);
      this.router.navigateByUrl('/');
    })


  }
  testing($event) {
    console.log('hello');
    console.log($event);
  }
  getList() {
    var category;
    var area;
    if (this.selectedCategory === 'All' || this.selectedCategory === undefined) {
      this.http.post('/areas', { 'city': this.location.address_state }).subscribe((areaObj) => {
        console.log(areaObj);
        area = areaObj[0].id;
        this.http.post('/searchJobs', { area: area, category: 'all' }).subscribe((data) => {
          console.log(data);
          this.searchJob = data;
          this.searchUser = this.searchJob.users;
          this.searchJob = this.searchJob.jobs;
          console.log(this.searchJob);
        })
      })
    } else {
      //  var query = { 'category': this.selectedCategory, 'city': this.location.address_state}
      this.http.post('/category', { 'category': this.selectedCategory, }).subscribe((catObj) => {
        category = catObj[0].id;
        this.http.post('/areas', { 'city': this.location.address_state }).subscribe((areaObj) => {
          console.log(areaObj);
          area = areaObj[0].id;
          this.http.post('/searchJobs', { area: area, category: category }).subscribe((data) => {
            this.searchJob = data;
            this.searchUser = this.searchJob.users;
            this.searchJob = this.searchJob.jobs;
            console.log(this.searchJob, 'job');
            console.log(data, 'data');
            console.log(this.searchUser, 'user');
          })
        })
      })
    }
    this.updateOnMap();
  }
  getuser():void {
    this.dashboardService.getUser()
    .subscribe((user) => {
      this.user = user;
      this.getlatlng(this.user.area).then((listen) => {
        console.log('chore near you', listen);
      })
    })
  }
  getjob():void {
    this.dashboardService.getJobs()
    .subscribe((jobs) => {
      this.jobs = jobs;
      console.log(this.jobs);
    });
  }
  ngOnInit() {
    // this.http.get('/user').subscribe((user) => {
    //   // console.log(user);
    //   this.user = user;
    //   // console.log(this.user.area);
    //   this.getlatlng(this.user.area).then((listen) => {
    //     console.log('getting all the chores', listen);
    //   });

    // })
    // this.http.get('/jobs').subscribe((jobs) => {
    //   this.jobs = jobs;
    // })
    this.getuser();
    this.getjob();
  }

}
